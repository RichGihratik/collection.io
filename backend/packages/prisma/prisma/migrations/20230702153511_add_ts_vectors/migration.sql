-- Add vectors and GIN indexes for full text search

ALTER TABLE "Collection" ADD COLUMN "ts_eng" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'english', 
        "name" || ' ' || "description" || ' ' || "themeName"
        )
      ) STORED;

ALTER TABLE "Collection" ADD COLUMN "ts_rus" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'russian', 
        "name" || ' ' || "description" || ' ' || "themeName"
        )
      ) STORED;


ALTER TABLE "Item" ADD COLUMN "ts_eng" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'english', 
        "name"
        )
      ) STORED;


ALTER TABLE "Item" ADD COLUMN "ts_rus" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'russian', 
        "name"
        )
      ) STORED;


ALTER TABLE "ItemValue" ADD COLUMN "ts_eng" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'english', 
        "value"
        )
      ) STORED;


ALTER TABLE "ItemValue" ADD COLUMN "ts_rus" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'russian', 
        "value"
        )
      ) STORED;


ALTER TABLE "ItemComment" ADD COLUMN "ts_eng" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'english', 
        "content"
        )
      ) STORED;


ALTER TABLE "ItemComment" ADD COLUMN "ts_rus" tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'russian', 
        "content"
        )
      ) STORED;