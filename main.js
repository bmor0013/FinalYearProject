var app = new Vue({
    el: '#app',
    // storing the state of the page
    data: {
        connected: false,
        ros: null,
        ws_address: 'ws://0.0.0.0:9090',
        logs: [],
        loading: false,
        topic: null,
        msg: null,
        listener: null,  

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
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
        },
       
        setMessage: function() {
            this.msg = new ROSLIB.Message({
                linear: { x: 1, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0, },
            })
            //this.setMessage()
            this.topic.publish(this.msg)
        },

        setListener: function() {
            this.listener = new ROSLIB.Topic({
                ros: this.ros,
                name: '/listener',
                messageType: 'std_msgs/String'
            })
                this.listener.subscribe('/robot_state_publisher') 
                console.log('Recieved message on' + this.listener.name + ':' + this.message.data )
                //this.listener.unsubscribe()
        }, 
        
    },
    mounted() {
    },
})
    