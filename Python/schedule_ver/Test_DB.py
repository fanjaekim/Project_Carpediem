import pymysql #pymysql 가져옴
import schedule
import time
import datetime
import os

def job():
      
      file = open('list.txt','r')

      Guild_DB = pymysql.connect( # DB 연결
            user='root',
            passwd='gkatn0512',
            host='127.0.0.1',
            db='test1',
            charset='utf8'
      )

      mycursor = Guild_DB.cursor() # cursor 객체 생성(연결 DB와 상호 작용)
      sql = "TRUNCATE TABLE copy_lists"
      mycursor.execute(sql)
      Guild_DB.commit()

      for line in file:
            position = line.split()[0] # 길드원 직위
            name = line.split()[1] # 길드원 이름
            insert_db_data = (name, position)
            delete_db_data = (name, name)
            #sql = "TRUNCATE TABLE copy_lists"
            #sql2 = "Insert into Management_lists(Position, Life, Name) values ('부마스터','0','오렌쥐냐')"
            #sql3 = "delete Name from Manage_lists a where not exists ( select Name from Copy_lists Name where %s = %s)"
            
            sql2 = "Insert into copy_lists(Name, Ranking) values (%s,%s)"
            mycursor.execute(sql2,insert_db_data)
            Guild_DB.commit()
      file.close()

      file = open('list.txt','r')
      for line in file:
            position = line.split()[0] # 길드원 직위
            name = line.split()[1] # 길드원 이름
            insert_db_data = (position, name, name)
            sql3 = "delete from Manage_lists where not exists ( select * from Copy_lists where Name = manage_lists.Name )"
            mycursor.execute(sql3)
            Guild_DB.commit()
            
            sql4 = "Insert IGNORE into Manage_lists(Ranking, Name, Tag) values (%s, %s, %s)"
            mycursor.execute(sql4,insert_db_data)
            Guild_DB.commit()
            
      file.close()
      Guild_DB.close() # DB close
      if os.path.isfile('list.txt'):
            os.remove('list.txt')
      else:
            print('Error : File not Exist')
      
              
schedule.every().dat.at("00:05:00").do(job)

while True:
      schedule.run_pending()
      time.sleep(1)

              
