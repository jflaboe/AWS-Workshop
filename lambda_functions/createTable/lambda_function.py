import sys
import os
import logging
import rds_config
import pymysql


rds_host  = "dotdev-workshop.cluster-cwujtc69zdof.us-east-2.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
def lambda_handler(event, context):
    """
    This function fetches content from MySQL RDS instance
    """

    item_count = 0

    with conn.cursor() as cur:
        cur.execute("create table People ( PID int NOT NULL AUTO_INCREMENT, \
                                            First varchar(255) NOT NULL, \
                                            Last varchar(255) NOT NULL, \
                                            Food varchar(255), \
                                            Color varchar(255), \
                                            Major varchar(255), \
                                            PRIMARY KEY (PID))")
        cur.execute('INSERT INTO People (First, Last) VALUES ("Declan", "Jensen")')
        cur.execute('INSERT INTO People (First, Last, Color, Major) VALUES ("Josh", "Toby", "Red", "Electrical Engineering")')
        cur.execute('INSERT INTO People (First, Last, Food, Color, Major) VALUES ("Luke", "Liu", "Chic-fil-a", "Maize", "Computer Science")')
        conn.commit()
        cur.execute("select * from People")
        for row in cur:
            item_count += 1
            logger.info(row)
            #print(row)
    conn.commit()

    return "Added %d items from RDS MySQL table" %(item_count)