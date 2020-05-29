from psycopg2.extras import RealDictCursor
import database_common


@database_common.connection_handler
def insert_registration(cursor: RealDictCursor, users: dict):
    query = """
        INSERT INTO users (username, password)
        VALUES (%(u_name)s, %(p_word)s);"""
    cursor.execute(query, {
        'u_name': users['username'],
        'p_word': users['password']
    })
    return