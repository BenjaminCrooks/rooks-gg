import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv
from functions import *

load_dotenv()
key = os.getenv("APIKEY")

host = os.getenv("MONGO_HOST", "localhost")
port = int(os.getenv("MONGO_PORT", 27017))
dbname = os.getenv("DB_NAME")
collmatch = os.getenv("COLLECTION_MATCH")
collparticipants = os.getenv("COLLECTION_PARTICIPANT")


### Setup
try:
    accountFile = os.path.join(os.getcwd(), "accounts.json")
    with open(accountFile, "r") as file:
        accountJson = json.load(file)

    client = MongoClient(host, port)
    db = client[dbname]
    collection_match = db[collmatch]
    collection_participants = db[collparticipants]

except Exception as error:
    print(f"Setup error: {error}")
    raise SystemExit(1)


### Account processing
for account in accountJson:
    if not account["active"]:
        continue

    try:
        accountRes = fetch_account(account["puuid"], key)
        if "status" in accountRes:
            raise Exception(f"Status {accountRes['status']['status_code']}: {accountRes['status']['message']}")

        puuid = accountRes["puuid"]
        gameName = accountRes["gameName"]

        ### Match History
        # Query db for most recent matchids
        lastDoc = collection_match.find_one({"puuid": puuid}, sort=[("gameDateTimestamp", -1)])
        lastMatchId = lastDoc["metadata"]["matchId"] if lastDoc else None
        if lastMatchId == None:
            raise Exception(f"MongoDB match history returned nothing")

        historyRes = fetch_history(puuid, 420, 30, key)
        if "status" in historyRes:
            raise Exception(f"Status {historyRes['status']['status_code']}: {historyRes['status']['message']}")

        # Filter missing matches
        newMatchIds = []
        for matchId in historyRes:
            if matchId == lastMatchId:
                break
            newMatchIds.append(matchId)

        ### Match Data
        for matchId in newMatchIds:
            try:
                matchResponse = fetch_match(matchId, key)
                if "status" in matchResponse:
                    raise Exception(f"Status {matchResponse['status']['status_code']}: {matchResponse['status']['message']}")

                # MongoDB document insertion
                match_data, participant_data = format_data(matchResponse, puuid)
                collection_match.insert_one(match_data)
                collection_participants.insert_one(participant_data)

            except Exception as matchErr:
                print(f"[{gameName}] match {matchId} failed: {matchErr}")
                continue

    except Exception as accountErr:
        print(f"[{account['puuid']}] account failed: {accountErr}")
        continue

client.close()