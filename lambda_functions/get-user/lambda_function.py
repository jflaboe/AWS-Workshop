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
    filters = json.loads(event['body'])
    query_string = "SELECT * FROM People"
    
    where_clause = " AND ".join([str(key) + " LIKE '%" + value + "%'" for key,value in filters.items()])
    logger.info(where_clause)
    if len(where_clause) > 0:
        query_string += " WHERE " + where_clause
        
    item_count = 0

    with conn.cursor() as cur:
        
        conn.commit()
        cur.execute(query_string)
        result = cur.fetchall()
        logger.info(result)
        logger.info(type(result))
    conn.commit()
    
    output = {"data": []}
    for row in result:
        output_row = {}
        output_row["ID"] = row[0]
        output_row["First"] = row[1]
        output_row["Last"] = row[2]
        output_row["Food"] = row[3]
        output_row["Color"] = row[4]
        output_row["Major"] = row[5]
        output["data"].append(output_row)

    return {
        'statusCode': 200,
        'body': json.dumps(output),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }