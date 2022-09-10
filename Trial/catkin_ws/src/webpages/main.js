var app = new Vue({
    el: '#app',
    // storing the state of the page
    data: {
        connected: false,
        ros: null,
        ws_address: 'ws://0.0.0.0:9090',
        logs: [],
        pose: [], 
        localList: [],
        localName: [], 
        loading: false,
        topic: null,
        msg: null,
        listener: null,
        message: null, 
        name: document.getElementById('name').value 
        

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
       
        setMessage: function(message) {
            if (message) {
                this.msg = message.data 
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
        },

        startListener: function () {
            this.setListener()
            this.listener.subscribe(function(message){
                this.pose.unshift(message.data)
                //window.localStorage.setItem(this.name,JSON.stringify(message))
                this.listener.unsubscribe()
            })
        }, 

        saveToList: function () {
            this.localList.unshift(this.pose[0])
            this.localName.unshift(this.name)
            //window.localStorage.setItem(this.name,JSON.stringify(message))

        },

        sendList: function (localList) {
            for (i=0; i<length(localList); i++) {
                this.setMessage(localList[i])
                sleep(100)
            }
        }
        
    },
    mounted() {
    },
})
    