SELECT T.StartTime, T.BreezecardNum, T.StartsAt, S.Name, S.EnterFare FROM Trip AS T, Station AS S
WHERE T.BreezecardNum IN (SELECT B.BreezecardNum FROM Breezecard AS B WHERE B.BreezecardNum NOT IN (SELECT C.BreezecardNum FROM Conflict AS C) AND BelongsTo = 'kellis') 
AND T.EndsAt is NULL
AND T.StartsAt = S.StopID;

SELECT R.BreezecardNum, R.StartTime, R.Tripfare, R.Source, S1.Name AS Destination FROM (SELECT T.BreezecardNum, T.StartTime, T.Tripfare, S.Name AS Source, T.EndsAt FROM Trip AS T, Station AS S
WHERE T.BreezecardNum IN 
(SELECT BreezecardNum FROM Breezecard AS B 
	WHERE B.BelongsTo = '?' AND B.BreezecardNum 
	NOT IN (SELECT BreezecardNum FROM Conflict))
AND T.StartsAt = S.StopID) AS R, Station AS S1
WHERE R.EndsAt = S1.StopID
AND StartTime >= '?' 
AND StartTime <= '?';




