CREATE TABLE User (
    Username VARCHAR(64),
    Password VARCHAR(64) NOT NULL,
    isAdmin	 BOOLEAN	 NOT NULL,
    PRIMARY KEY(Username));

CREATE TABLE Passenger(
	Username VARCHAR(64),
	Email	 VARCHAR(64) NOT NULL,

	PRIMARY KEY(Username),
	FOREIGN KEY (Username) REFERENCES User(Username) ON UPDATE CASCADE
	ON DELETE CASCADE,
	UNIQUE(Email));

CREATE TABLE Breezecard(
	Cnum Char(16),
	Value Decimal(6,2) NOT NULL,
	Psgr_username VARCHAR(64),
	PRIMARY KEY (Cnum),
	FOREIGN KEY (Psgr_username) REFERENCES User(Username) ON DELETE SET NULL ON UPDATE CASCADE,
	CHECK(Value >= 0.0 AND Value <= 1000.00)
);

CREATE TABLE Conflict(
	Psgr_username VARCHAR(64),
	Card_num CHAR(16),
	Date_time DATE,
	PRIMARY KEY(Psgr_username, Card_num),
	FOREIGN KEY(Psgr_username) REFERENCES Passenger(Username) ON DELETE CASCADE ON UPDATE RESTRICT,
	FOREIGN KEY(Card_num) REFERENCES Breezecard(Cnum) ON DELETE RESTRICT ON UPDATE RESTRICT);

CREATE TABLE Station(
	Stop_id INT,
	Enter_fare Decimal(4,2) NOT NULL,
	Close_status BOOLEAN NOT NULL,
	isTrainStation BOOLEAN NOT NULL,
	Name VARCHAR(15) NOT NULL,
	PRIMARY KEY(Stop_id),
	UNIQUE(Name),
	CHECK(Enter_fare >= 0 AND Enter_fare <= 50));

CREATE TABLE Bus_station(
	Stop_id INT,
	Intersection INT,
	PRIMARY KEY(Stop_id),
	FOREIGN KEY(Stop_id) REFERENCES Station(Stop_id) ON DELETE CASCADE ON UPDATE CASCADE);


CREATE TABLE Trip(
	Card_num CHAR(16) NOT NULL,
	Start_time TIMESTAMP NOT NULL,
	Current_fare Decimal(10,2) NOT NULL,
	Origin_id INT,
	Destination_id INT,
	PRIMARY KEY(Card_num, Start_time),
	FOREIGN KEY(Origin_id) REFERENCES Station(Stop_id) ON DELETE SET NULL ON UPDATE SET NULL,
	FOREIGN KEY(Destination_id) REFERENCES Station(Stop_id) ON DELETE SET NULL ON UPDATE SET NULL,
	FOREIGN KEY(Card_num) REFERENCES Breezecard(Cnum) ON DELETE RESTRICT ON UPDATE RESTRICT);



