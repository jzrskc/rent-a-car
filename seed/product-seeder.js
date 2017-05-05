var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/rentacar');

// products je sada kolekcija
var products = [
    new Product({
        imagePath: 'http://res.cloudinary.com/dllclpxlh/image/upload/v1493977417/mercedes-benzE_hmwrgj.png',
        title: 'Mercedes-Benz E',
        description: 'The Mercedes-Benz E-Class is offered in four body styles (sedan, wagon, coupe and convertible), with a choice of several engines and rear or all-wheel drive. The sedan and wagon are available in high-performance AMG form. Competitors include the BMW 5 Series, Audi A6 and Infiniti Q70.',
        type: 'personal',
        price: 50
    }),
    new Product({
        imagePath: 'http://res.cloudinary.com/dllclpxlh/image/upload/v1493977401/alfa-romeo-4c-spider_q0zexz.png',
        title: 'Alfa Romeo 4C Spider',
        description: 'The 2016 Alfa Romeo 4C is a sporty, performance-oriented two-door that\'s available in coupe and convertible (Spider) form. The 2016 Alfa Romeo 4C coupe and Spider get new available carbon fiber and leather styling options, and a newly available electronically controlled dual-mode exhaust system...',
        type: 'personal',
        price: 60
    }),
    new Product({
        imagePath: 'http://res.cloudinary.com/dllclpxlh/image/upload/v1493977421/porsche-boxer_ebrwsc.png',
        title: 'Porsche Boxster 2016',
        description: 'The Porsche Boxster is a two-seat roadster that competes against the Audi TT, BMW Z4 and Mercedes-Benz SLC-Class. A high-performance Spyder version of the Boxster is now available...',
        type: 'personal',
        price: 70
    }),
    new Product({
        imagePath: 'http://res.cloudinary.com/dllclpxlh/image/upload/v1493977406/aston-martin-v8-vabtage_tcnnqi.png',
        title: 'Aston Martin V8 Vantage',
        description: 'V8 Vantage is the cornerstone of the Vantage family. Its proportions are timelessly beautiful yet the surfaces have a sculptural muscularity that conveys the dynamism of the driving experience. The purity of design speaks of its innate poise...',
        type: 'personal',
        price: 80
    }),
    new Product({
        imagePath: 'http://res.cloudinary.com/dllclpxlh/image/upload/v1493977414/ford-f-350_ixerfo.png',
        title: 'Ford F-350 Pickup',
        description: 'The F-Series Super Duty is Ford\'s line of heavy-duty pickup trucks, which are available in a variety of body styles, cargo-bed configurations and three model series: F-250, F-350 and F-450. This truck can carry as many as six people in the four-door crew-cab model...',
        type: 'terrain',
        price: 90
    }),
    new Product({
        imagePath: 'http://res.cloudinary.com/dllclpxlh/image/upload/v1493977409/audi-q5_rq44hp.png',
        title: 'Audi Q5',
        description: 'The Q5 competes in the crowded compact luxury crossover segment that includes the Acura RDX, BMW X3 and Volvo XC60. It seats five and comes with standard all-wheel drive. In addition to four-cylinder and V-6 gas engines...',
        type: 'terrain',
        price: 100
    })
];

var done = 0;
products.forEach(function(item) {
  item.save();
  done++;
  if (done === products.length) mongoose.disconnect();
});

/*
var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
*/
