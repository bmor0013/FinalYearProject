#!/usr/bin/env python2.7
import rospy 
import moveit_commander 
import sys 
#import numpy as np 
from geometry_msgs.msg import Pose
from std_msgs.msg import String 

group_name = "panda_arm"
move_group = moveit_commander.MoveGroupCommander(group_name)

#pub = rospy.Publisher('my_new_topic',String,queue_size=10) 

def callback(data): 
    #Will call the moveitgroup to move the robot
    print("I heard",data)
    move_group.set_pose_target(data)
     
    #pub.publish("I got message") 
    move_group.go(wait=True)

def talker():
    rospy.init_node('listenerandtalker', anonymous = True)
    rospy.Subscriber("/chatter",Pose, callback)
    pub = rospy.Publisher('/talk', Pose, queue_size=10)
    #rospy.init_node('talker', anonymous=True)
    rate = rospy.Rate(10) # 10hz
    while not rospy.is_shutdown():
        #listener() 
        Pose2 = move_group.get_current_pose().pose
        #rospy.loginfo(Pose2)
        pub.publish(Pose2)
        rate.sleep()


if __name__ == '__main__':
    try: 
        talker()
    except rospy.ROSInterruptException:
        pass
