var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('messagesdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'messagesdb' database");
        console.log("Connected to 'messagesdb' database");
        db.collection('messages', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'messages' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findByIdRestful = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving message: ' + id);
    db.collection('messages', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAllRestful = function(req, res) {
    db.collection('messages', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving message: ' + id);
    db.collection('messages', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    console.log("route to message list page...")
    db.collection('messages', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log("find all msgs is :", items);
            res.render('list', {
                title: 'Ready to add one new message by findAll',
                messages:items
            });
        });
    });
};

exports.addOne = function(req, res) {
    console.log("route to adding one message...");
    res.render('add_message',{ title: 'Adding one message' });
};

exports.saveOne = function(req,res){
    console.log("route to saving one message...");

    var subject = req.body.subject;
    var contents = req.body.contents;
    var author = req.body.author;
    var thumbnailFileName =""  ;
    if (req.files.thumbnailFile.size) {
        thumbnailFileName = req.files.thumbnailFile.path.substring(req.files.thumbnailFile.path.lastIndexOf('/')+1);
    }
    var audioFileName =""  ;
    if (req.files.audioFile.size) {
        audioFileName = req.files.audioFile.path.substring(req.files.audioFile.path.lastIndexOf('/')+1);
    }
    var videoPosterFileName =""  ;
    if (req.files.videoPosterFile.size) {
        videoPosterFileName = req.files.videoPosterFile.path.substring(req.files.videoPosterFile.path.lastIndexOf('/')+1);
    }
    var videoFileName =""  ;
    if (req.files.videoFile.size) {
        videoFileName = req.files.videoFile.path.substring(req.files.videoFile.path.lastIndexOf('/')+1);
    }
    var d =new Date();
    var createDate =  d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();


    db.collection('messages', function(err, collection) {
        collection.insert({
            subject: subject,
            contents: contents,
            author: author,
            thumbnailFile: thumbnailFileName,
            audioFile: audioFileName,
            videoPosterFile: videoPosterFileName,
            videoFile: videoFileName,
            date: createDate
        }, function(err) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success saving one document.');
                res.redirect('/messages')
            }
        });
    });
};
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var messages = [
        {
            thumbnailFile: "14eb64c12ec32083480d3442d42b194e.jpg",
            subject: "Announcement-- ES IT Mobility Challenge",
            contents: "HP is behind the industry today for mobility, and the simple fact is that we need to work hard and work fast to leap ahead of our competition.Using mobile solutions, we need to fundamentally improve the experience of our end users and the business models they employ to transact their work. Here our challenge to publish one mobile application a week beginning March 1st.<br/><br/> Please watch this message from Mahesh Shah who runs the Service Management Engineering function in ES-IT, to understand not only why this challenge is important, but what you can do to help HP leap ahead.<br/><br/>You find detailed information for each of the steps that Mahesh described here.  And to assist you on your journey we have created a OneHP page where we will post updates for where we are in this journey, and where you can post your questions for the Mobility team.<br/><br/> Tough?  You bet.  Let us show the world that we are sure up to the challenge. YOU know you are.<br/><br/> Let the race begin!<br/><br/> Sylvia Mabunay, Service Management Engineering. <br/>Mobility Team, Program Sponsor<br/><br/> Sukanya Krishnamurthi, Service Management Engineering<br/> Mobility Team, Program Manager<br/>",
            audioFile: "14eb64c12ec32083480d3442d42b194n.mp3",
            videoPosterFile: "74eb64c12ec32083480d3442d42b194e.png",
            videoFile: "14eb64c12ec32083480d3442d42b194m.m4v",
            author: "Sukanya Krishnamurthi",
            date: "2013-06-01"
        },
        {
            thumbnailFile: "24eb64c12ec32083480d3442d42b194e.jpg",
            subject: "Iraq launches a major step in energy supply and the world's largest flare reduction project",
            contents: "South Gas Company, Shell and Mitsubishi today officially announced the commencement of operations of Basrah Gas Company, which will be the largest gas project in Iraq history and the world's largest flares reduction project.",
            audioFile: "14eb64c12ec32083480d3442d42b194n.mp3",
            videoPosterFile: "",
            videoFile: "",
            author: "Geng,ze",
            date: "2013-06-01"
        },
        {
            thumbnailFile: "34eb64c12ec32083480d3442d42b194e.jpg",
            subject: "Diamond miner Alrosa mulls over 14% stake sale to raise $2bn",
            contents: "CRN reports that HP is developing AppSystems prepackaged appliances, which are based on HP ProLiant DL980 server and integrate SAP HANA in-memory database with SAP Business Suite ERP applications. The 1-TB edition is currently available, while the 2-TB and 4-TB versions are expected to ship soon. HP is also offering services to help companies deploy SAP HANA and Business Suite software through HP Enterprise Cloud Services.",
            audioFile: "14eb64c12ec32083480d3442d42b194k.mp3",
            videoPosterFile: "14eb64c12ec32083480d3442d42b194t.png",
            videoFile: "14eb64c12ec32083480d3442d42b194j.mp4",
            author: "ke-jun.xu@hp.com",
            date: "2013-06-01"
        },
        {
            thumbnailFile: "44eb64c12ec32083480d3442d42b194e.jpg",
            subject: "HP's Whitman seen as stabilizing presence",
            contents: "TheStreet writes that HP Meg Whitman appears to have brought stability to the company. The outlet also argues that former CEO Mark Hurd departure represents HP most egregious mistake, citing HP stock performance before, during and after his tenure",
            audioFile: "",
            videoPosterFile: "74eb64c12ec32083480d3442d42b194e.png",
            videoFile: "14eb64c12ec32083480d3442d42b194m.m4v",
            author: "foo.off@hp.com",
            date: "2013-06-01"
        },
        {
            thumbnailFile: "54eb64c12ec32083480d3442d42b194e.jpg",
            subject: "HP's Mayer talks datacenter networking, introduces SDN products at Interop",
            contents: "PC Magazine highlights HP Bethany Mayer keynote from Interop, which emphasized how HP HSR 6800 router and FlexFabric switches can improve data center networking. The outlet notes that HP has five SDN-based applications, which include support for a virtual cloud network, sentinel security, load balancing, WAN bursting and unified communications for Microsoft Lync",
            audioFile: "14eb64c12ec32083480d3442d42b194k.mp3",
            videoPosterFile: "14eb64c12ec32083480d3442d42b194t.png",
            videoFile: "14eb64c12ec32083480d3442d42b194j.mp4",
            author: "jack.chun@hp.com",
            date: "2013-06-01"
        }];
    db.collection('messages', function(err, collection) {
        collection.insert(messages, {safe:true}, function(err, result) {});
    });

};

