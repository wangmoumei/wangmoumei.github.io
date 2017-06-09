function autoEmail(e, emails) {
    var that = this, show = false, box = document.createElement("ul"), index = -1;
    
    box.id = "tipBox";
    e.parentNode.appendChild(box);
    e.onkeydown = function (event) {
        var even = event || window.event || arguments.callee.caller.arguments[0];
        if (show && even && even.keyCode == 13) {
            box.style.display = "none"; show = false;
            var chosen = document.getElementById("chosen");
            if (chosen) e.value = chosen.innerHTML;
            return;
        }
    }
    e.onkeyup = function (event) {
        var even = event || window.event || arguments.callee.caller.arguments[0];
        if (show && even && (even.keyCode == 38 || even.keyCode == 40 || even.keyCode == 13)) {
            var lst = box.getElementsByTagName("li");
            if (even.keyCode == 38) {
                //$("#show").text("shang");
                index--;
                if (index < 0) index = lst.length - 1;
            }
            if (even.keyCode == 40) {
                //$("#show").text("xia");
                index++;
                if (index >= lst.length) index = 0;
            }
            if (lst[index]) {
                var chosen = document.getElementById("chosen");
                if (chosen) chosen.id = "";
                lst[index].id = "chosen";
            }
            return;
        }
        
        var val = this.value, str = "<li class='phone'>" + val + "</li>";
        if (!show) {
            if (val.length < 1) return;
            show = true;
            box.style.display = "block";
        } else {
            if (val.length < 1) {
                that.close();
            }
        }
        if (! /^[0-9]+$/.test(val)) { str = ""; }
        for (var i = 0; i < emails.length; i++) {
            if (val.indexOf("@") > 0) {
                
                if (emailServer[i].indexOf(val.slice(val.indexOf("@") + 1)) >= 0) {
                    str += "<li>" + val.slice(0, val.indexOf("@")) + "@" + emails[i] + "</li>";
                }
            } else {
                str += "<li>" + val + "@" + emails[i] + "</li>";
            }
        }
        if (str.length > 0) {
            box.innerHTML = str;
            that.initEvent();
        } else {
            that.close();
        }
    };
    e.addEventListener("blur", function () {
        that.close();
        var chosen = document.getElementById("chosen");
        if (chosen) e.value = chosen.innerHTML;
        index = -1;
    });
    this.initEvent = function () {
        var lst = box.getElementsByTagName("li");
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].dataset) lst[i].dataset.index = i;
            lst[i].onmouseover = function () {
                var chosen = document.getElementById("chosen");
                if (chosen) chosen.id = "";
                this.id = "chosen";
                index = (parseInt(this.dataset.index) == "NaN") ? -1 : parseInt(this.dataset.index);
                
            }
        }
    }
    this.close = function () {
        show = false;
        box.style.display = "none";
    }
    return this;
}