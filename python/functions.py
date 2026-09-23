import requests
import json
import time
import datetime



# Returns a dictionary from a json link
# 100 requests per 2 minutes = 1.2 sec between requests
def request_json(link, retries=5, delay=1):
    for attempt in range(retries):
        try:
            response = requests.get(link, timeout=10)
        except (requests.ConnectionError, requests.Timeout) as e:
            if attempt == retries - 1:
                raise
            wait = delay * (2 ** attempt)
            print(f"Network error ({e}), retrying in {wait}s...")
            time.sleep(wait)
            continue

        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", delay * (2 ** attempt)))
            print(f"Rate limited, waiting {retry_after}s...")
            time.sleep(retry_after)
            continue

        if response.status_code >= 500:
            if attempt == retries - 1:
                response.raise_for_status()
            wait = delay * (2 ** attempt)
            print(f"Server error {response.status_code}, retrying in {wait}s...")
            time.sleep(wait)
            continue

        return response.json()

    raise Exception(f"Max retries ({retries}) exceeded for {link}")    

# Returns RIOT account information {puuid, gameName, tagLine}
def fetch_account(puuid, key):
    request = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/" + puuid + "?api_key=" + key
    return request_json(request)

# Returns RIOT account information {puuid, gameName, tagLine}
def fetch_summoner(gameName, tagLine, key):
    request = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagLine + "?api_key=" + key
    return request_json(request)

# Returns match history [NA_0000000000, ...]; ranked = 420, count = 0-100 (default 20)
def fetch_history(puuid, queueid, count, key):
    request = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?queue=" + str(queueid) + "&count=" + str(count) + "&api_key=" + key
    return request_json(request)

# Returns match data {...}
def fetch_match(matchid, key):
    request = "https://americas.api.riotgames.com/lol/match/v5/matches/" + str(matchid) + "?api_key=" + key
    return request_json(request)


# Returns the player's ROLE; most common of the 4 given 'role variables'
def customVarRole(indPos, lane, role, teamPos):
    # role_variables = [indPos, lane, role, teamPos]
    role_variables = [role if role != "UTILITY" else "SUPPORT" for role in [indPos, lane, role, teamPos]]
    return max(set(role_variables), key=role_variables.count)

# Returns date
def dateTimestamp(gameStartTimestamp, gameDuration):
    # gameStartTimestamp = ms; timePlayed = sec
    combinedUnix = int(gameStartTimestamp)/1000 + int(gameDuration)
    return datetime.datetime.fromtimestamp(combinedUnix)

# Returns datetime delta
def lengthTimeDelta(gameDuration):
    delta = str(datetime.timedelta(seconds = gameDuration)).split(":")
    return {
        "h": int(delta[0]),
        "m": int(delta[1]),
        "s": int(delta[2])
    }

def format_data(apiResponse, puuid):

    ###  Participant Data
    participants = apiResponse["info"]["participants"]

    # find (self) participant
    for participant in participants:

        # set custom position attribute
        participant["position"] = customVarRole(participant["individualPosition"], participant["lane"], participant["role"], participant["teamPosition"])

        # remove unnecessary attributes
        participant.pop("missions", None)
        participant.pop("placement", None)
        participant.pop("playerAugment1", None)
        participant.pop("playerAugment2", None)
        participant.pop("playerAugment3", None)
        participant.pop("playerAugment4", None)
        participant.pop("playerAugment5", None)
        participant.pop("playerAugment6", None)
        participant.pop("playerSubteamId", None)
        participant.pop("subteamPlacement", None)

        if participant["puuid"] == puuid:
            participant_self = participant
            selfIndex = participant["participantId"]
            selfTeamId = participant["teamId"]

    # remove (self) from participant array
    participants.pop(selfIndex - 1)

    # assign (other players) ally/enemy & custom position attribute
    for participant in participants:
        if participant["teamId"] == selfTeamId:
            participant["relationship"] = "ally"
        else:
            participant["relationship"] = "enemy"

    # participant final output
    participant_data = {
        "matchId": apiResponse["metadata"]["matchId"],
        "participants": participants
    }

    
    ### Match Data
    match_data = participant_self
    match_data["metadata"] = apiResponse["metadata"]
    match_data["info"] = apiResponse["info"]
    
    # replace match[info][participants] with custom var
    match_data["info"]["participants"] = {
        "ally": [],
        "enemy": []
    }
    
    for player in participant_data["participants"]:
        match_data["info"]["participants"][player["relationship"]].append({
            "championId": player["championId"],
            "championName": player["championName"],
            "riotIdGameName": player["riotIdGameName"],
            "riotIdTagline": player["riotIdTagline"],
            "relationship": player["relationship"],
            "position": player["position"],
        })

    # add custom (more) variables
    match_data["gameDateTimestamp"] = dateTimestamp(match_data["info"]["gameStartTimestamp"], match_data["info"]["gameDuration"])
    match_data["gameLength"] = lengthTimeDelta(match_data["info"]["gameDuration"])
    match_data["items"] = [
        match_data["item0"],
        match_data["item1"],
        match_data["item2"],
        match_data["item3"],
        match_data["item4"],
        match_data["item5"],
        match_data["item6"]
    ]

    # re-structure perks
    customPerks = {"primaryStyle": None, "subStyle": None}
    for style in match_data["perks"]["styles"]:
        customPerks[style["description"]] = style
    match_data["perks"]["styles"] = customPerks

    return match_data, participant_data