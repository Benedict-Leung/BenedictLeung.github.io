$(document).ready(function() {   
    var radius = 8;
    TweenMax.staggerFromTo(".blob", 4 ,{
      cycle: {
        attr:function(i) {
          var r = i*90;
          return {
            transform:"rotate("+r+") translate("+radius+",0.1) rotate("+(-r)+")"
          }      
        }
      }  
    },{
      cycle: {
        attr:function(i) {
          var r = i*90+360;
          return {
            transform:"rotate("+r+") translate("+radius+",0.1) rotate("+(-r)+")"
          }      
        }
      },
      ease:Linear.easeNone,
      repeat:-1
    });

    let previousPanel = 0;
    let currentPanel = 0;
    let run = false;

    function resetHR() {
        $(".skill").css("transform", "");
        $("input").add("textarea").blur();
        
        $("hr").animate({
            width: "25%"
        }, {
            duration: 100
        });

        $(".panel-title").stop(true, false);
        $(".panel-title").animate({
            left: "-50%",
            opacity: "0"
        }, {
            duration: 800
        });

        $(".text-container").stop(true, false);
        $(".text-container").animate({
            left: "25%",
            opacity: "0"
        }, {
            duration: 800
        });
    }

    function activateHR(resize = false) {
        let names = ["welcome", "about", "skills", "projects", "contact"];

        if (previousPanel != currentPanel || resize) {
            if (previousPanel != currentPanel)
                resetHR();
    
            $("hr." + names[currentPanel] + "Button").animate({
                width: "50%"
            }, {
                duration: 100
            });
            previousPanel = currentPanel;

            if (currentPanel != 2 && currentPanel != 3) {
                $("." + names[currentPanel] + " .panel-title").stop(true, false);
                $("." + names[currentPanel] + " .text-container").stop(true, false);

                $("." + names[currentPanel] + " .panel-title").animate({
                    left: "0",
                    opacity: "1"
                }, {
                    duration: 800
                });

                $("." + names[currentPanel] + " .text-container").delay(800).animate({
                    left: "50%",
                    opacity: "1"
                }, {
                    duration: 800
                });
            } else {
                let elements = $("." + names[currentPanel] + ".panel .skill");
                let r = Math.min(window.innerHeight, window.innerWidth) / 3 + "px";
                let start = -90;
                let length = elements.length;
                let sliceOffset = 360 / length;
            
                elements.each(function (i) {
                    let angle = sliceOffset * i + start;
                    let reverseRotate = -angle;
            
                    $(this).css({
                        "transform": "rotate(" + angle + "deg) translate(" + r + ") rotate(" + reverseRotate + "deg)"
                    });
                });
            }
            scrollPanel();
        } else {
            run = false;
        }
    }

    function scrollPanel() {
        $(".container").animate({
            scrollTop: window.innerHeight * currentPanel
        }, {
            duration: 100,
            complete: function() {
                setTimeout(() => run = false, 700);
            } 
        });
    }

    function slideDown() {
        if (!run) {
            run = true;
            currentPanel = Math.min(4, currentPanel + 1);
            activateHR();
        }
    }

    function slideUp() {
        if (!run) {
            run = true;
            currentPanel = Math.max(0, currentPanel - 1);
            activateHR();
        }
    }

    $(".welcomeButton").click(() => {
        currentPanel = 0;
        activateHR();
    });

    $(".aboutButton").add("#learn").click(() => {
        currentPanel = 1;
        activateHR();
    });

    $(".skillsButton").click(() => {
        currentPanel = 2;
        activateHR();
    });

    $(".projectsButton").click(() => {
        currentPanel = 3;
        activateHR();
    });

    $(".contactButton").click(() => {
        currentPanel = 4;
        activateHR();
    });
    
    $(".container").on("mousewheel DOMMouseScroll", function(e) {
        if (!e.ctrlKey) {
            e.preventDefault();
            if (e.originalEvent.deltaY > 50 || e.originalEvent.detail > 0 ) {
                slideDown();
            } else if (e.originalEvent.deltaY < -50 || e.originalEvent.detail < 0) {
                slideUp();
            }
        }
    });

    let ts;
    let multiTouch = false;
    $(".container").bind("touchstart", function(e) {
        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
        ];
        var element = $(".container");
        element.data("scroll-position", scrollPosition);
        element.data("previous-overflow", element.css("overflow"));
        element.css("overflow", "hidden");
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        if (e.touches.length == 1) {
            multiTouch = false;
            ts = e.originalEvent.touches[0].clientY;
        } else {
            multiTouch = true;
        }
    });

    $(".container").bind("touchend", function(e) {
        if (!multiTouch) {
            e.preventDefault()
            var te = e.originalEvent.changedTouches[0].clientY;
    
            if (ts > te + 100) {
                slideDown();
            } else if (ts < te - 100) {
                slideUp()
            } else {
                $(".skill-overlay").add("img").removeClass("hover");
                $("input").add("textarea").blur();
                $($(e.target).parents(".skill-overlay")[0]).addClass("hover");

                if ($(e.target).is("img"))
                    $(e.target).addClass("hover");
                
                if ($(e.target).is("input") || $(e.target).is("textarea"))
                    $(e.target).focus()
    
                $(e.target)[0].click(function() {
                    let labelID = $(this).attr("for");
                    $("#"+labelID).trigger("click");
                });
            }
        }
    });

    $(window).on("resize", function() {
        $(".skill-overlay").add("img").removeClass("hover");
        activateHR(true);
    });

    $(".form").on("submit", function(e) {
        e.preventDefault();
        emailjs.sendForm("service_ls3c1xa", "template_46yhkvp", this)
        .then(function(response) {
            alert("Thanks for your message!");
        }, function(error) {
            alert("Something went wrong...");
        });
        $(".form")[0].reset();
    });
});