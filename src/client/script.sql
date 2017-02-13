CREATE TABLE Artist(
  ID serial PRIMARY KEY,
  Name varchar(40) NOT NULL
);

CREATE TABLE Track(
  ID serial PRIMARY KEY,
  Title varchar(50) NOT NULL,
  ArtistID integer REFERENCES Artist
);

CREATE TABLE Bar(
  ID serial PRIMARY KEY,
  Position smallint,
  TrackID integer REFERENCES Track
);

CREATE TABLE Word(
  ID serial PRIMARY KEY,
  Value varchar(50)
);

CREATE TABLE BarWord(
  ID serial PRIMARY KEY,
  BarID integer REFERENCES Bar,
  WordID integer REFERENCES Word,
  Position smallint
);

CREATE TABLE Rhyme(
  ID serial PRIMARY KEY,
  BarWordID integer REFERENCES BarWord,
  Syllable varchar(15),
  StartAt smallint,
  ParentID integer REFERENCES Rhyme
);
