SELECT T.StartTime, T.BreezecardNum, T.StartsAt, S.Name, S.EnterFare FROM Trip AS T, Station AS S
WHERE T.BreezecardNum IN (SELECT B.BreezecardNum FROM Breezecard AS B WHERE B.BreezecardNum NOT IN (SELECT C.BreezecardNum FROM Conflict AS C) AND BelongsTo = 'kellis') 
AND T.EndsAt is NULL
AND T.StartsAt = S.StopID;

