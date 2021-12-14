import pymysql #pymysql 가져옴
import schedule
import time
import datetime
import os

def job():
    Guild_DB = pymysql.connect( # DB 연결
          user='root',
          passwd='gkatn0512',
          host='127.0.0.1',
          db='test1',
          charset='utf8'
    )

    mycursor = Guild_DB.cursor() # cursor 객체 생성(연결 DB와 상호 작용)


          
    sql2 = "Update IGNORE Manage_lists set Life = Life - 7 WHERE Life > 0"
    mycursor.execute(sql2)
    Guild_DB.commit()

schedule.every().monday.at("00:03:00").do(job)

while True:
      schedule.run_pending()
      time.sleep(1)
