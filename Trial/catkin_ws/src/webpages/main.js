
var app = new Vue({
    el: '#app',
    // storing the state of the page
    data: {
        connected: false,
        ros: null,
        ws_address: 'ws://0.0.0.0:9090',
        logs: [],
        pose: [], 
        localName: [],
        listSend: [], 
        loading: false,
        topic: null,
        msg: null,
        listener: null,
        //message: null,       
        addSuccess: false,
        poseCount: 0,

    },
    // helper methods to connect to ROS
    methods: {
        connect: function() {
            this.loading = true
            this.ros = new ROSLIB.Ros({
                url: this.ws_address
            })
            this.ros.on('connection', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Connected!')
                this.connected = true
                this.loading = false
            })
            this.ros.on('error', (error) => {
                this.logs.unshift((new Date()).toTimeString() + ` - Error: ${error}`)
            })
            this.ros.on('close', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Disconnected!')
                this.connected = false
                this.loading = false
            })
        },
        disconnect: function() {
            this.ros.close()
        }, 

        setTopic: function() {
            this.topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/chatter',
                messageType: 'geometry_msgs/Pose'
            })
        },
       
        setMessage: function(mail) {
            if (mail) {
                this.msg = mail 
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
        },


        setListener: function() {
            this.listener = new ROSLIB.Topic({
                ros: this.ros,
                name: '/talk',
                messageType: 'geometry_msgs/Pose'
            })
            this.connecttoDB()
        },

        connecttoDB: function(){
            _MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
                if(err){
                    console.log('Err',err); 

                } else{
                    console.log("Connected Successfully to the Server"); 
                    db = client.db("websiteDB")
                }
            })

        },

        startListener: function () {
            this.setListener(); 
            this.listener.subscribe(function(message) {
                app.pose.unshift(message)
                app.listener.unsubscribe()
            })
        }, 

        saveToList: function () {
            let pose1 = {
                name: document.getElementById('name2').value,
                data: this.pose[0]
            }
            this.localName.unshift(pose1)
            this.addSuccess = true;
            setTimeout(() => this.addSuccess = false, 5000)
        },

        selectPose: function(index) {
            poseCount++
            this.selectedPoses.push({index: 0})
        },
        saveToDB: function() {            
            db.collection('poses').insertOne({
                name: document.getElementById('name2').value,
                data: this.pose[0]
            })
        },

        sendList: function () {
            //s = document.getElementById("dropDown").options[document.getElementById("dropDown").selectedIndex].text; 
            //sent = app.localName.find(x => x.name === "pose1").data
            //for(let i=0; i < this.poseCount; i++) {
                
            for (i= this.listSend.length; i==0; i--){
                name2 = eval("pose"+(i+1)).options[eval("pose"+(i+1)).selectedIndex].text 
                sent = app.localName.find(pose => pose.name == name2)
                console.log(sent)
                this.setMessage(sent.data)
                //sleep(1000)
            }
        }
    },
    mounted() {
    },
})



//window.localStorage.setItem(this.name,JSON.stringify(message)) 
