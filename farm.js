const express = require('express');
//const localStorage = require('node-localstorage');

const bodyParser = require('body-parser');
var mysql = require("mysql");
var fileup = require("express-fileupload");
var path = require("path");
var nodemailer = require('nodemailer')
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

mongoose.connect('mongodb+srv://admin-farmmitra:farmmitra.user@cluster1.tctdt.mongodb.net/farmappss?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("public1"));
app.use(express.urlencoded({ extended: true }));
app.use(fileup());
app.set('view engine', 'ejs');
//var localStorage = new LocalStorage('./scratch');


var transport = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'farmmitra2021@gmail.com',
            pass: process.env.pswdd
        }
    }
)



app.get("/", function (req, resp) {
    var filePath = path.join(path.resolve(), "public", "page1.html");
    resp.sendFile(filePath);
});


const feedback = new mongoose.Schema({
    Name: String,
    Email: String,
    Feedbac: String
})

const Feedback = mongoose.model('Feedback', feedback);

app.post("/save-feedback", function (req, resp) {

    const feed = new Feedback({
        Name: req.body.nam,
        Email: req.body.ema,
        Feedbac: req.body.fee
    })

    feed.save();
    console.log("saved");

});



app.get("/farmp", function (req, resp) {
    var filePath = path.join(path.resolve(), "public", "profile2.html");
    resp.sendFile(filePath);
});


const fprofile = new mongoose.Schema({
    Farmid: String,
    Name: String,
    Phone: Number,
    Email: String,
    upi: String,
    latitude: String,
    longitude: String
})

const FarmerProfile = mongoose.model('FarmerProfile', fprofile);


app.post("/farmp-save", function (req, resp) {


    const prod = new FarmerProfile({
        Farmid: req.body.id,
        Name: req.body.naam,
        Phone: req.body.phone,
        Email: req.body.email,
        upi: req.body.upi,
        latitude: req.body.lati,
        longitude: req.body.longi
    })


    prod.save();
    console.log("farmer profile saved");

});

app.get("/vendorp", function (req, resp) {
    resp.render("profile2.ejs");
});


const vprofile = new mongoose.Schema({
    Farmid: String,
    Name: String,
    Phone: Number,
    Email: String,
    upi: String,
    Firm: String,
    Address: String,
    latitude: String,
    longitude: String
})

const VendorProfile = mongoose.model('VendorProfile', vprofile);


app.post("/vendor-save", function (req, resp) {


    const vend = new VendorProfile({
        Farmid: req.body.id,
        Name: req.body.naam,
        Phone: req.body.phone,
        Email: req.body.email,
        upi: req.body.upi,
        Firm: req.body.firm,
        Address: req.body.addr,
        latitude: req.body.lati,
        longitude: req.body.longi
    })


    vend.save();
    console.log("vendor profile saved");

});


var ss = [];
var ss1 = [];
var ss2 = [];
var ss3 = [];

FarmerProfile.find(function (err, result) {
    if (err) {
        console.log(err);

    }
    else {
        //   console.log(result);
        result.forEach(function (fru) {
            ss.push(fru.Name);
            ss1.push(fru.Phone);


        });
    }

});
VendorProfile.find(function (err, result) {
    if (err) {
        console.log(err);

    }
    else {
        //   console.log(result);
        result.forEach(function (fru) {
            ss2.push(fru.Name);
            ss3.push(fru.Phone);


        });
    }

});


// app.get("/the", function (req, resp) {


//     resp.render("requests", { newlist: ss, newlist1: ss1, newlist2: ss2, newlist3: ss3 });
// });


app.get("/crops", function (req, resp) {
    var filePath = path.join(path.resolve(), "public", "crops.html");
    resp.sendFile(filePath);
});

const vcrops = new mongoose.Schema({
    Vendorid: String,
    Wheat: Number,
    Rice: Number,
    Cotton: Number,
    Maize: Number
})

const CropsPrice = mongoose.model('CropsPrice', vcrops);

app.post("/crops-save", function (req, resp) {


    const price = new CropsPrice({
        Vendorid: req.body.vid,
        Wheat: req.body.pwheat,
        Rice: req.body.price,
        Cotton: req.body.pcotton,
        Maize: req.body.pmaize
    })

    price.save();
    console.log("saved");

})

const frequest = new mongoose.Schema({
    Vendorid: String,
    Farmid: String,
    Crop: String,
    Quantity: String
})

const Requests = mongoose.model('Requests', frequest);

app.post("/liked", function (req, resp) {
    const requ = new Requests({
        Vendorid: req.body.vi,
        Farmid: req.body.fi,
        Crop: req.body.cn,
        Quantity: req.body.qn

    })
    requ.save();
    resp.redirect("/then");
})

app.get("/pp", function (req, resp) {
    var ss = Math.random();
    console.log(ss);
})


app.get("/farmd", function (req, resp) {
    var filePath = path.join(path.resolve(), "public", "fdata.html");
    resp.sendFile(filePath);
});


const fdata = new mongoose.Schema({
    Vendorid: String,
    lendAmount: Number,
    lendInterest: Number,
    loanAmount: Number,
    loanInterest: Number,
    Farmerid: String,
    Date: String,
    Code: Number
})

const FarmerData = mongoose.model('FarmerData', fdata);


var dss;
app.post("/data-save", function (req, resp) {

    var otp = Math.random();
    otp = otp * 1000000;
    var ccd = Math.floor(otp);
    console.log(ccd);
    VendorProfile.find({ Farmid: req.body.vid }, function (err, result) {
        if (err) {
            console.log(err);

        }
        else {
            console.log(req.body.fid)
            console.log(result);
            result.forEach(function (fru) {
                dss = fru.Email;

                var mailOptions = {
                    from: 'farmmitra2021@gmail.com',
                    to: dss,
                    subject: 'request',
                    text: "Farmer Lend you amount of Rs" + req.body.vm + "Share Your Code if true information" + ccd
                }
                transport.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("done")
                    }
                })


                const dat = new FarmerData({
                    Vendorid: req.body.vid,
                    lendAmount: req.body.vm,
                    lendInterest: req.body.vi,
                    loanAmount: 0,
                    loanInterest: 0,
                    Farmerid: req.body.fid,
                    Code: ccd
                })

                dat.save();

                resp.redirect("/verify");



            });



        }

    });



});




app.get("/verify", function (req, resp) {
    var filePath = path.join(path.resolve(), "public", "verify.html");
    resp.sendFile(filePath);
});



const verifieddata = new mongoose.Schema({
    Vendorid: String,
    lendA: Number,
    lendI: Number,
    loanA: Number,
    loanI: Number,
    Farmerid: String

})

const FarmerVerified = mongoose.model('FarmerVerified', verifieddata);




app.post("/vf", function (req, resp) {
    FarmerData.find({ Farmerid: req.body.fid, Vendorid: req.body.vid }, function (err, result) {
        if (err) {
            console.log(err);

        }
        else {
            //   console.log(result);
            result.forEach(function (fru) {
                console.log(fru.Code);
                if (fru.Code == req.body.code) {
                    console.log("reached");

                    const ver = new FarmerVerified({
                        Vendorid: req.body.vid,
                        lendA: fru.lendAmount,
                        lendI: fru.lendInterest,
                        loanA: 0,
                        loanI: 0,
                        Farmerid: req.body.fid

                    })
                    ver.save();
                    console.log("verifed");

                    FarmerData.deleteMany({ Farmerid: req.body.fid }, { Vendorid: req.body.vid }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("deleted successfullyy");
                        }


                    })
                    resp.redirect("/then");


                }
                else {
                    FarmerData.deleteMany({ Farmerid: req.body.fid }, { Vendorid: req.body.vid }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("deleted successfullyy");
                        }


                    })
                    console.log(req.body.code + "  ");
                    resp.send("wrong info.");
                }



            });
        }

    });

});

app.get("/fsaved", function (req, res) {

    res.render("falana.ejs");

})

app.post("/fsaveddata", function (req, res) {


    console.log("yha tak to ana he chahiye" + req.body.fid);
    FarmerVerified.find({ Farmerid: req.body.fid }, function (err, foundUser) {
        console.log("yha aya kya ?" + foundUser);
        res.render("fsaveddata", { farmid: foundUser });
    });
});

app.post("/vsaveddata", function (req, res) {


    console.log("yha tak to ana he chahiye" + req.body.vvid);
    FarmerVerified.find({ Vendorid: req.body.vvid }, function (err, foundUser) {
        console.log("yha aya kya ?" + foundUser);
        res.render("vsaveddata", { farmid: foundUser });
    });
});


app.get("/contactus", function (req, resp) {
    resp.render("contactus");
})



const contactus = new mongoose.Schema({
    Naam: String,
    Gender: String,
    Mobile: Number,
    Email: String,
    Msg: String
});

const ContactUs = new mongoose.model("ContactUs", contactus);


app.post("/contact-save", function (req, resp) {

    const cont = new ContactUs({
        Naam: req.body.name,
        Gender: req.body.gender,
        Mobile: req.body.number,
        Email: req.body.email,
        Msg: req.body.Message
    });

    cont.save();
    resp.redirect("/");
})

app.get("/see", function (req, resp) {
    console.log(req.body);



})

app.get("/chat", function (req, resp) {
    var filePath = path.join(path.resolve(), "index.html");
    // resp.sendFile(filePath);
    resp.redirect('https://farmmitra2021.github.io/practicumproject/');

})

app.get("/aboutus", function (req, resp) {
    var filePath = path.join(path.resolve(),"public" ,"aboutus", "about.html");
    resp.sendFile(filePath);

})

app.get("/flogin", function (req, resp) {
    resp.render("home");


});

app.get("/vlogin", function (req, resp) {
    resp.render("vhome");


});


app.get("/f-old-login", function (req, res) {
    res.render("login");
});

app.get("/v-old-login", function (req, res) {
    res.render("vlogin");
});




app.get("/f-register", function (req, res) {
    res.render("register");
});

app.get("/v-register", function (req, res) {
    res.render("vregister");
});


const fegister = new mongoose.Schema({
    Email: String,
    Pass: String
});

const Fregister = new mongoose.model("Fregister", fegister);

const vegister = new mongoose.Schema({
    Email: String,
    Pass: String
});

const Vregister = new mongoose.model("Vregister", vegister);

app.post("/f-register", function (req, res) {
    const newUser = new Fregister({
        Email: req.body.username,
        Pass: req.body.password
    });

    newUser.save(function (err) {
        if (err) {
            console.log("err")
        }
        else {
            res.render("login");
        }
    });
});

app.post("/v-register", function (req, res) {
    const newUser = new Vregister({
        Email: req.body.username,
        Pass: req.body.password
    });

    newUser.save(function (err) {
        if (err) {
            console.log("err")
        }
        else {
            res.render("vlogin");
        }
    });
});


var t8;


app.post("/f-old-login", function (req, resp) {
    const username = req.body.username;
    const password = req.body.password;

    Fregister.findOne({ Email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            if(foundUser){
                if (foundUser.Pass == password) {

                    t8 = foundUser.Email;
                    console.log("re");
                    //  localStorage.setItem("farmid", foundUser._id);
                    resp.redirect("/then");
                }
                else {
                    console.log("wrong pass");
                    resp.redirect("/f-old-login");
                }
            }
            else{
                resp.redirect("/f-old-login");
            }
        }
    });
});



app.get("/then", async function (req, resp) {

    console.log("yha bhi");
    var t1 = [];
    var t2 = [];
    var t3 = [];
    var t4 = [];
    var t5 = [];
    var t6 = [];
    var t7 = [];

    try {
        const result = await CropsPrice.find();
        for (var i = 0; i < result.length; i++) {
            t1.push(result[i].Wheat);
            t2.push(result[i].Rice);
            t3.push(result[i].Cotton);
            t4.push(result[i].Maize);
            t5.push(result[i].Vendorid);

            try {
                const resu = await VendorProfile.find({ Farmid: result[i].Vendorid });
                t6.push(resu[0].Address);
                t7.push(resu[0].Name);
                console.log(resu);
            }
            catch (err) {
                console.log(err);
            }



        }




    }
    catch (err) {
        console.log(err);
    }
    console.log(t6);

    resp.render("showvend", { p1: t1, p2: t2, p3: t3, p4: t4, p5: t5, p6: t6, p7: t7, p8: t8 });















    //     CropsPrice.find().then(function (err, result) {
    //         result.forEach(function (fru) {

    //             t1.push(fru.Wheat);
    //             t2.push(fru.Rice);
    //             t3.push(fru.Cotton);
    //             t4.push(fru.Maize);
    //             t5.push(fru.Vendorid);

    // .then(VendorProfile.find({ Farmid: fru.Vendorid }.then(function (result) {


    //             }))

    // })

    // CropsPrice.find(function (err, result) {
    //     if (err) {
    //         console.log(err);

    //     }
    //     else {
    //         //   console.log(result);
    //         result.forEach(function (fru) {

    //             t1.push(fru.Wheat);
    //             t2.push(fru.Rice);
    //             t3.push(fru.Cotton);
    //             t4.push(fru.Maize);
    //             t5.push(fru.Vendorid);


    //             VendorProfile.find({ Farmid: fru.Vendorid }, function (err, result) {
    //                 if (err) {
    //                     console.log(err);

    //                 }
    //                 else {
    //                     //   console.log(result);
    //                     result.forEach(function (frui) {
    //                         t6.push(frui.Address);
    //                         t7.push(frui.Name);
    //                         console.log(t6)
    //                         console.log(t7)
    //                     });
    //                 }

    //             });
    //             setTimeout(function () {
    //                 console.log(t6);
    // resp.render("showvend", { p1: t1, p2: t2, p3: t3, p4: t4, p5: t5, p6: t6, p7: t7, p8: t8 });

    //             }, 5000);


    //         });
    //     }


    // });







});
app.post("/checkrequests", function (req, resp) {

    var re1 = [];
    var re2 = [];
    var re3 = [];
    var re4;


    console.log("reached");
    Requests.find({ Vendorid: req.body.vid }, function (err, result) {
        if (err) {
            console.log(err);

        }
        else {
            re4 = req.body.vid;
            console.log(result);
            result.forEach(function (fru) {
                console.log(fru.Farmid);
                re1.push(fru.Farmid);
                re2.push(fru.Crop);
                re3.push(fru.Quantity);
            })


        }
        console.log(re1[0]);
        resp.render("list.ejs", { r1: re1, r2: re2, r3: re3, r4: re4 });
    })



});


app.post("/v-old-login", function (req, resp) {
    const username = req.body.username;
    const password = req.body.password;

    Vregister.findOne({ Email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                if (foundUser.Pass === password) {
                    //  localStorage.setItem("farmid", foundUser._id);
                    resp.render("vendor.ejs", { v1: foundUser.Email });
                }
            }
            else {
                resp.send("no id with this email");
            }
        }
    });
});

app.post("/req-reply", function (req, resp) {
    console.log(req.body.venid);
    console.log(req.body.farmid);
    console.log(req.body.cp);


    var mailOptions = {
        from: 'farmmitra2021@gmail.com',
        to: req.body.farmid,
        subject: 'request',
        text: "your request to Vendor with id" + req.body.venid + " have been accepted and try to reach at the vendor as soon as possible"
    }
    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("done")
        }
    })

    Requests.deleteOne({ Farmid: req.body.farmid }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("deleted successfullyy");
        }

    });




});


app.listen(process.env.PORT || 3000, function () {
    console.log("server started");
});

//mongodb+srv://admin-akminder:<password>@cluster0.jteyk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

//mongosh "mongodb+srv://cluster0.jteyk.mongodb.net/myFirstDatabase" --username akmin20105

//mongo "mongodb+srv://cluster0.jteyk.mongodb.net/myFirstDatabase" --username akmin20105
//mongo "mongodb+srv://cluster0.jteyk.mongodb.net/farmapp" --username akmin20105

//  mongodb+srv://akmin20105:7087170871@cluster0.jteyk.mongodb.net/farmapp?retryWrites=true&w=majority'}