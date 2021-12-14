import pymysql #pymysql 가져옴
import schedule
import time
import datetime
import os

Guild_DB = pymysql.connect( # DB 연결
      user='root',
      passwd='gkatn0512',
      host='127.0.0.1',
      db='test1',
      charset='utf8'
)

mycursor = Guild_DB.cursor() # cursor 객체 생성(연결 DB와 상호 작용)


      
sql2 = "Update Manage_lists set Life = -1 where Name='히시어로'"
mycursor.execute(sql2)
Guild_DB.commit()
