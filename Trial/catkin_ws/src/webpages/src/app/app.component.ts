import { Component } from '@angular/core';

import { DbServiceService } from './db-service.service';
import * as ROSLIB from 'roslib';
import { waitForAsync } from '@angular/core/testing';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private dbService: DbServiceService) {
    this.onGetPoses();
    this.connect();
    //this.startListener();
  }


  connected: boolean = false;
  ros: any = null;
  ws_address: string = 'ws://localhost:9090' //'ws://0.0.0.0:9090'
  logs: string[] = [];
  pose: any[] = [] 
  localName: any[] = []
  listSend: any[] = [] 
  loading: boolean = false;
  topic: any = null;
  msg: any = null;
  listener: any = null;
  //message: null,       
  addSuccess: boolean = false;
  poseCount: any[] = [];

  poseName: string = "";



  connect() {
    this.loading = true
    this.ros = new ROSLIB.Ros({
        url: this.ws_address
    })
    this.ros.on('connection', () => {
        this.logs.unshift((new Date()).toTimeString() + ' - Connected!')
        this.connected = true
        this.loading = false
    })
    this.ros.on('error', (error: any) => {
        this.logs.unshift((new Date()).toTimeString() + ` - Error: ${error}`)
    })
    this.ros.on('close', () => {
        this.logs.unshift((new Date()).toTimeString() + ' - Disconnected!')
        this.connected = false
        this.loading = false
    })
}

disconnect() {
    this.ros.close()
} 

setTopic() {
    this.topic = new ROSLIB.Topic({
        ros: this.ros,
        name: '/chatter',
        messageType: 'geometry_msgs/Pose'
    })
}

setMessage(mail: any) {
    if (mail) {
        this.msg = new ROSLIB.Message(mail) 
    }
    else 
    { 
        this.msg = new ROSLIB.Message({
            position: { x: 0.4, y: 0.1, z: 0.4, },
            orientation: { x: 0, y: 0, z: 0,w: 1},
        })
    }
  this.setTopic()
  this.topic.publish(this.msg)            
}


setListener() {
    this.listener = new ROSLIB.Topic({
        ros: this.ros,
        name: '/talk',
        messageType: 'geometry_msgs/Pose'
    })
}

startListener() {
    this.setListener(); 
    this.listener.subscribe((message: any) => {
        this.pose.unshift(message)
        this.listener.unsubscribe()
    })
}


onSavePose() {
  let poseToSave = {
    name: this.poseName,
    data: this.pose[0]
}
  this.dbService.savePose(poseToSave).subscribe(() => {
    this.onGetPoses();
    this.addSuccess = true;
    setTimeout(() => this.addSuccess = false, 5000)
  })
  
}

onGetPoses() {
    this.dbService.getPoses().subscribe((data: any) => {
      this.localName = data;
      console.log(data)
    });
  }

onDeletePose() {
    this.dbService.deletePose(this.poseName);
  }

newPoseBox() {
  this.poseCount.push("")
  console.log(this.poseCount)
}

sleep(milliseconds:any){
  var start = new Date().getTime();
  for(var i=0;i<1e7; i++){
    if((new Date().getTime()-start)>milliseconds){
      break;
    }
  }

}

sendList() {
  for(let i=0;i<this.poseCount.length;i++){
    let name2:string; 
    let sent;  
    name2  = eval("Pose"+(i)).options[eval("Pose"+(i)).selectedIndex].text
    sent = this.localName.find(pose => pose.name == name2)
    console.log(sent)
    this.setMessage(sent.data)
    this.sleep(10000)
    

  }
}




}


