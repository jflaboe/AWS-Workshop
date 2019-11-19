import sys
import os
import logging
import rds_config
import pymysql
import json


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
    fields = json.loads(event['body'])
    query_string = "INSERT INTO People "
    cols = "(" + ",".join([str(key) for key, value in fields.items()]) + ")"
    vals = "(" + ",".join(['"' + str(value) + '"' for key, value in fields.items()]) + ")"
    
    
    query_string = query_string + " " + cols + " VALUES " + vals
    with conn.cursor() as cur:
        
        conn.commit()
        cur.execute(query_string)
    conn.commit()
    

    return {
        'statusCode': 200,
        'body': "success",
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }