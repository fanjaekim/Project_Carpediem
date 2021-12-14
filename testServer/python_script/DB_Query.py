import pymysql #pymysql 가져옴
import schedule
import time
import datetime

def job():
            
      file = open('new_test.txt','r')

      Guild_DB = pymysql.connect( # DB 연결
            user='root',
            passwd='fanjae1123',
            host='127.0.0.1',
            db='carpediem_test',
            charset='utf8'
      )

      mycursor = Guild_DB.cursor() # cursor 객체 생성(연결 DB와 상호 작용)

      for line in file:
            position = line.split()[0] # 길드원 직위
            name = line.split()[1] # 길드원 이름
            #sql = "Insert into Guild_List(Position, Name) values ('2', '오렌쥐당')"
            sql = "Insert IGNORE into Guild_list(Position, Name) values (%d, %s)" # IGNORE : 중복시 무시
            data = (position,name) # 튜플에 담음
              
            mycursor.execute(sql,data) # sql 및 데이터로 쿼리 실행 
            Guild_DB.commit() # commit을 이용한 DB반영
      Guild_DB.close() # DB close

      print('done')
        
schedule.every().dat.at("00:02:00").do(job)

while True:
      schedule.run_pending()
      time.sleep(1)
      
