
window.onload =  function () {

    // hamburger menu icon 

    const hamburger = document.querySelector (".hamburger") 
    let isOpen = false 

    hamburger.onclick = function () {
        if (isOpen) { 
            document.querySelector(".navBar") .classList.remove ("open") 
            isOpen = false  
        } else {
            document.querySelector(".navBar") .classList.add ("open") 
            isOpen = true
        }
    }
    
    // Our Story delayed load

    document.querySelectorAll (".timelineEntry") .forEach ( function (entry, index) {
        setTimeout (function () {
            entry.classList.add ("delay")
        }, 1000 * index) 
    })
    
    // Our Photos carousels

    const dogPhotos = [
        {
            imgSrc : "Photos/Pets_Ellie_Hiking_Maine_2020.jpeg",
            caption: "Pawe&#322; adopted Ellie in August 2013."
        },
        {
            imgSrc : "Photos/Pets_Acadia.jpeg",
            caption: "We adopted Acadia together in February 2021."
        },
        {
            imgSrc : "Photos/Pets_Ellie_Acadia_Bed.jpeg",
            caption: "Acadia has loved Ellie since their first day together - Ellie wasn't so sure."
        },
        {
            imgSrc : "Photos/Pets_Ellie_Acadia_LongIsland.jpeg",
            caption : "Now, the two of them get along famously."
        },
        {
            imgSrc : "Photos/Pets_Zaphod.jpeg",
            caption : "We loved Zaphod from September 2014 until October 2019."
        }
    ]

    const travelPhotos = [
        {
            imgSrc : "Photos/Vacation_2014_Athens.jpg",
            caption : "2014 - our first trip together, to Greece (Athens, Mykonos, and Santorini.)"
        },
        {
            imgSrc : "Photos/Vacation_2016_Warsaw.jpg",
            caption : "2016 - we went to Krakow and Warsaw in Poland, and Budapest in Hungary."
        },
        {
            imgSrc : "Photos/Vacation_2016_Poland_Babcia.jpeg",
            caption : "2016 - we even got to spend time with Pawe&#322;'s grandmother."
        },
        {
            imgSrc : "Photos/Vacation_2017_Ithaca.jpeg",
            caption : "2017 - we spent a weekend in Ithaca with our friends."
        },
        {
            imgSrc : "Photos/Vacation_2018_Disney.jpg",
            caption : "2018 - we celebrated Paulina's 25th birthday with a trip to Disney World!"
        },
        {
            imgSrc : "Photos/Vacation_2018_Kyoto_Japan.jpeg",
            caption: "2018 - we also got to visit Japan! We saw Tokyo, Hakone, and Kyoto together, then Pawe&#322; went to Nara, Osaka, and Hiroshima."
        },
        {
            imgSrc : "Photos/Vacation_2019_LA_Broad.jpeg",
            caption: "2019 - we went to California and road tripped from San Francisco to San Diego for Fletcher and Kelly's wedding."
        },
        {  
            imgSrc : "Photos/Vacation_2020_Boston.jpeg",
            caption : "2020 - we went to PAX east in Boston in early March 2020, right before everything shut down."
        },
        {
            imgSrc : "Photos/Vacation_2021_Portland_2.jpeg",
            caption : "2021 - we visited Fletcher and Kelly in Portland, Oregon."
        }
    ]

    const yearsPhotos = [
        {
            imgSrc : "Photos/Years_2013_Hiking.jpg",
            caption: "2013 - This was our second date!"
        },
        {
            imgSrc : "Photos/Years_2014_Paulinabirthday.jpg",
            caption : "2014 - Our first time celebrating birthdays together"
        },
        {
            imgSrc : "Photos/Years_2015_NYU_Formal.jpg",
            caption : "2015 - At an NYU formal ahead of graduation."
        },
        {
            imgSrc : "Photos/Years_2016_Color_Run.jpg", 
            caption : "2016 - Our first 5K together: the Color Run."
        },
        {
            imgSrc : "Photos/Years_2017_Strand.jpg",
            caption : "2017 - An event at the Strand Rare Book Room, one of Paulina's favorite places in NYC!"
        },
        { 
            imgSrc : "Photos/Years_2018_Bronx_Zoo_5K.jpg",
            caption : "2018 - The Bronx Zoo 5K in support of large cats."
        },
        {
            imgSrc: "Photos/Years_2018_Irit_Wedding.jpg",
            caption: "2018 - Paulina's cousin Irina's wedding, one of 2 we attended that year. "
        },
        { 
            imgSrc : "Photos/Years_2019_Jazz_Age_Lawn_Party_2.jpg",
            caption: "2019 - the Jazz Age Lawn Festival."
        },
        {
            imgSrc : "Photos/Years_2019_Sanchez_Wedding_2.jpeg",
            caption: "2019 - Kaytee and Vinny Sanchez's wedding, the last of 3 that year."
        },
        {
            imgSrc : "Photos/Years_2019_KatsWedding.jpeg",
            caption: "2019 - Kat Mintz' wedding, where Paulina was a bridesmaid."
        },
        {
            imgSrc : "Photos/Years_2020_Engagement.jpeg",
            caption: "2020 - it was a really difficult year, but we did have one great thing happen!"
        },
        {
            imgSrc : "Photos/Years_2021_LittleIsland.jpeg",
            caption: "2021 - sight seeing at Little Island, NYC."
        }
    ]
    
    const halloweenPhotos = [
        {
            imgSrc : "Photos/Halloween_2014.jpg",
            caption: "2014 - Mickey and Minnie Mouse"
        },
        {
            imgSrc : "Photos/Halloween_2015.jpg",
            caption: "2015 - Blue and Steve from Blue's Clues (Ellie wouldn't wear her mailbox costume.)"
        },
        {
            imgSrc : "Photos/Halloween_2016.jpeg",
            caption: "2016 - Little Red Riding Hood and the lumberjack (Ellie also wouldn't wear her granny costume.)"
        },
        {
            imgSrc : "Photos/Halloween_2017.jpg",
            caption : "2017 - Charlotte the Spider, Wilbur the pig, and the (worldwide) web - one of our favorite costumes!"
        },
        {
            imgSrc : "Photos/Halloween_2019.jpeg",
            caption: "2019 - Dorothy and the Cowardly Lion - unfortunately missing the Tin Man!"
        },
        {
            imgSrc : "Photos/Halloween_2020.jpeg",
            caption : "2020 - Jungle explorers and a lion."
        },
        {
            imgSrc : "Photos/Halloween_2021.jpeg",
            caption: "2021 - 3 bees and a beekeeper."
        }
    ] 

    const engagementPhotos = [
        {
            imgSrc : "Photos/Engagement_4.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_17.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_18.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_26.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_43.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_59.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_66.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_87.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_95.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_109.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_110.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_119.jpg",
            caption : ""
        },
        {
            imgSrc : "Photos/Engagement_126.jpg",
            caption : ""
        },
    ]

    function setupcarousel (photos, carouselClass) {
        if (!document.querySelector (carouselClass)) {
            return
        }
        document.querySelector (`${carouselClass} > div > div > img`) .setAttribute ("src", photos[0].imgSrc)
        document.querySelector (`${carouselClass} > div > .caption`) .innerHTML = photos[0].caption
        let counter = 0
        document.querySelector (`${carouselClass} > div > div > .next`) .onclick = function () {
            if (counter === photos.length - 1) {
                counter = 0
            } else {
                counter ++
            }
            document.querySelector (`${carouselClass} > div > div >  img`) .setAttribute ("src", photos[counter].imgSrc)
            document.querySelector (`${carouselClass} > div > .caption`) .innerHTML = photos[counter].caption
        }
        document.querySelector (`${carouselClass} > div > div > .back`) .onclick = function () {
            if (counter === 0) {
                counter = photos.length - 1
            } else {
                counter --
            }
            document.querySelector (`${carouselClass} > div > div > img`) .setAttribute ("src", photos[counter].imgSrc)
            document.querySelector (`${carouselClass} > div > .caption`) .innerHTML = photos[counter].caption
        }
    }

    setupcarousel (dogPhotos, ".dogCarousel") 
    
    setupcarousel (yearsPhotos, ".yearsCarousel")

    setupcarousel (travelPhotos, ".travelCarousel")

    setupcarousel (engagementPhotos, ".engagementCarousel")

    setupcarousel (halloweenPhotos, ".halloweenCarousel")
}
