var ott = {};
ott.$id = function(id){
    return typeof id === "object" ? id : document.getElementById(id)
}
ott.$tagName = function(tagName, parentNode){
    return (parentNode || document).getElementsByTagName(tagName);
}
ott.$className = function(className, tagName, parentnode){
    var reg = new RegExp("(^|\\s)" + className + "(\\s|$)");  //首尾什么都没有或含空白符，一个元素含有多个class时也可以正常获取 2016.12.02
    var elements = ott.$tagName(tagName, parentnode);
    var classElements = [];
    for(var i=0; i<elements.length; i++){
        reg.test(elements[i].className) && classElements.push(elements[i]);
    }
    return classElements;
}
ott.css = function(element, attr, value) {
    if (arguments.length == 2) {
        var style = element.style;
        var currentStyle = element.currentStyle;  //IE
        return currentStyle ? currentStyle[attr] : getComputedStyle(element, null)[attr];  //firefox
    } else if (arguments.length == 3) {
        element.style[attr] = value;
        /*switch (attr) {
            case "width":
            case "height":
            case "top":
            case "left":
            case "margin-top":
            case "margin-left":
            case "padding-top":
            case "padding-left":
            case "opacity":
                element.style.opacity = value;
                element.style.filter = "alpha(opacity=" + value * 100 + ")";
                break;
            default:
                element.style[attr] = value;
        }*/
    }
}
ott.attr = function(element, attr, value) {
    if(arguments.length == 2) {
        return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined;
    }
    else if(arguments.length == 3) {
        element.setAttribute(attr, value);
    }
}
ott.index = function(element){
    var children = element.parentNode.children;  //chidren指第一层子元素，childNodes还包括文本元素 2016.12.01
    for(var i=0; i<children.length; i++){
        if(children[i] === element) return i;
    }
}
ott.extend = function(destination, source){
    for(var property in source) destination[property] = source[property];
    return destination;
}
ott.animate = function(obj, json, opt){
    clearInterval(obj.timer);
    ////看不懂不想看看不懂不想看看不懂不想看看不懂不想看看不懂不想看2016.12.02////
    ////////////////////可是终于还是要看懂还是要写哇2016.12.03////////////////////
    clearInterval(obj.timer);
    obj.iSpeed = 0;
    opt = ott.extend({
        type: "buffer",
        callback: function(){
        }
    }, opt);
    obj.timer = setInterval(function(){
        var iCur = 0;
        var complete = !0;
        var property = null;
        var maxSpeed = 30;
        for(property in json){
            if(property == "opacity"){
                iCur = parseFloat(ott.css(obj, property));
            } else {
                iCur = parseInt(ott.css(obj, property));
            }
            switch(opt.type) {
                case "buffer":
                    obj.iSpeed = (json[property] - iCur) / 5;
                    obj.iSpeed = obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
                    json[property] == iCur || (complete = !1, ott.css(obj, property, property == "zIndex" ? iCur + obj.iSpeed || iCur * -1 : iCur + obj.iSpeed));
                    //这里不懂不懂不懂不懂这种写法我要骂人了哇！
                    break;
                case "flex":
                    obj.iSpeed += (json[property] - iCur) / 5;
                    obj.iSpeed *= 0.7;
                    obj.iSpeed = Math.abs(obj.iSpeed) > maxSpeed ? obj.iSpeed > 0 ? maxSpeed : -maxSpeed : obj.iSpeed;
                    Math.abs(json[property] - iCur) <=1 && Math.abs(obj.iSpeed) <= 1 || (complete = !1, ott.css(obj, property, iCur + obj.iSpeed));
                    break;
            }
        }
        if(complete) {
            clearInterval(obj.timer);
            if(opt.type == "flex") for(property in json) ott.css(obj, property, json[property]);
            opt.callback.apply(obj, arguments);
        }
    }, 30);
    //没太懂没太懂没太懂property == "zIndex" ? iCur + obj.iSpeed || iCur * -1 : iCur + obj.iSpeed这究竟是什么鬼呀！2016.12.03//
}


function complete() {
    var faceType = ott.$id("faceType");
    var faceList = ott.$id("content");
    var tools = ott.$id("tools");
    var search = ott.$id("search");
    var glassList = ott.$id("glassList");
    var glasses = ott.$id("glasses");

    //脸型筛选事件委托
    faceType.onclick = function(){
        event = event || window.event;
        var target = event.target || event.srcElement;
        var nowLi = ott.$className("now", "li", faceType)[0];
        var chooseFaces = [];
        var chooseData = "";
        if(target.tagName.toLowerCase() == "a"){
            chooseData = ott.attr(target, "data-type");
            nowLi.className = "";
            target.parentNode.className = "now";
            if(chooseData == "*"){
                for(var i=0; i<faceList.children.length; i++) chooseFaces.push(i);
            } else {
                chooseFaces = chooseData.split(",");
            }
            for(var i=0; i<faceList.children.length; i++){
                faceList.children[i].className = "hidden";
            }
            for(var i=0; i<chooseFaces.length; i++){
                faceList.children[chooseFaces[i]].className = "active";
            }
        }
    }

    //头像点击事件委托
    faceList.onclick = function(){
        event = event || window.event;
        var target = event.target || event.srcElement;
        //不需要选择脸型后禁用点击事件这么麻烦，直接在这里筛选掉就可以了 2016.12.01
        if(target.tagName.toLowerCase() == "img" && target.parentNode.className != "hidden"){
            ott.$id("photo").src = target.src.replace("model", "big");
            ott.css(ott.$id("cover"), "display", "block");
            ott.css(ott.$id("photo"), "display", "block");
            ott.css(ott.$id("tools"), "display", "block");
            ott.css(ott.$id("mask"), "display", "none");
        }
    }

    //工具栏事件委托
    tools.onclick = function() {
        event = event || window.event;
        var target = event.target || event.srcElement;
        switch (target.className) {
            case "open":
                target.className = "close";
                target.innerHTML = "收起";
                tools.style.height = "173px";
                break;
            case "close":
                target.className = "open";
                target.innerHTML = "展开";
                tools.style.height = "33px";
                break;
            case "reset":
                ott.css(glasses, "display", "none");
                ott.css(ott.$id("cover"), "display", "none");
                ott.css(ott.$id("photo"), "display", "none");
                ott.css(ott.$id("tools"), "display", "none");
                break;
        }
    }

    //搜索栏点击事件委托
    search.onclick = function(){
        event = event || window.event;
        var target = event.target || event.srcElement;
        var uls = ott.$tagName("ul", search);
        var nowUl = null;
        var nowLis = null;
        var selectedA = null;
        var param = "";

        switch (target.className){
            case "select":
                for(var i=0; i<uls.length; i++) ott.css(uls[i], "display", "none");
                nowUl = ott.$tagName("ul", target.parentNode)[0];
                ott.css(nowUl, "display", "block");
                document.onclick = function(){
                    this.onclick = null;
                    ott.css(nowUl, "display", "none");
                };
                event.stopPropagation();
                break;
            case "btn":
                param = ott.attr(ott.$className("selectWrap", "div", search)[0], "data-param");
                if(param == undefined){
                    alert("请选择品牌");
                } else {
                    alert("品牌编号：" + param + ".  一段Ajax调用");
                }
                break;
            default:
                if(target.tagName.toLowerCase() == "a"){
                    nowLis = ott.$tagName("li", target.parentNode.parentNode);
                    for(var i=0; i<nowLis.length; i++){
                        nowLis[i].className = "";
                    }
                    target.parentNode.className = "current";
                    selectedA = ott.$className("select", "a", target.parentNode.parentNode.parentNode)[0];
                    selectedA.innerHTML = target.innerHTML;  //显示选中内容的标签 2016.11.30
                    ott.attr(selectedA.parentNode, "data-param", ott.index(target.parentNode));
                }
        }
    }

    //点击眼镜并调整眼镜位置事件委托
    glassList.onclick = function(){
        //点击眼镜
        event = event || window.event;
        var target = event.target || event.srcElement;
        var imgSrc = "";
        for(var i=0; i<glassList.children.length; i++){
            ott.attr(glassList.children[i], "class", "");
        }
        if(target.tagName.toLowerCase() == "img" || target.tagName.toLowerCase() == "h5"){
            target = target.parentNode;
        }
        if(target.tagName.toLowerCase() == "li"){
            imgSrc = ott.$tagName("img", target)[0].src;
            ott.attr(target, "class", "current");
            //ott.attr(glasses, "class", "glasses");  //还原初始定位,但是为什么没有用
            ott.attr(glasses.children[0], "src", imgSrc.replace("jpg", "png"));
            ott.css(glasses, "display", "block");
        }
        //移动眼镜
        glasses.onmousedown = function(){
            event = event || window.event;
            var betweenXY = {x:(event.clientX - this.offsetLeft), y:(event.clientY - this.offsetTop)};
            document.onmousemove = function(){
                event = event || window.event;
                var photo = ott.$id("photo");
                var newGlassPosition = {x:(event.clientX - betweenXY.x), y:(event.clientY - betweenXY.y)};
                var maxPosition = {x:(photo.offsetWidth - glasses.offsetWidth), y:(photo.offsetHeight - glasses.offsetHeight)};
                newGlassPosition.x < 0 && (newGlassPosition.x = 0);
                newGlassPosition.y < 0 && (newGlassPosition.y = 0);
                newGlassPosition.x > maxPosition.x && (newGlassPosition.x = maxPosition.x);
                newGlassPosition.y > maxPosition.y && (newGlassPosition.y = maxPosition.y);
                ott.css(glasses, "left", newGlassPosition.x + "px");
                ott.css(glasses, "top", newGlassPosition.y + "px");
                return false;
            }
            document.onmouseup = function(){
                this.onmousemove = null;
                this.onmouseup = null;
                glasses.releaseCapture && glasses.releaseCapture();
            }
            this.setCapture && this.setCapture();
            return false;
        }
    }
}


window.onload = function(){
    var overlayDiv = ott.$id("overlay");
    var loadBar = ott.$id("load");
    var countSpan = ott.$tagName("span", loadBar)[0];
    var oP = ott.$tagName("p", loadBar)[0];
    var aData = [];
    var imgCount = 0;
    var loadedCount = 0;
    var allImg = [].concat("btn.gif", "ico.gif", "search.png", "loading.gif");
    for(var i=1; i<=12; i++){
        allImg = allImg.concat("model_" + i + ".jpg", "big_" + i + ".jpg", "glass_" + i + ".jpg", "glass_" + i + ".png");
    }
    for(var i=0, imgCount = allImg.length; i<imgCount; i++){
        (function(i){
            var aImg = new Image();
            aImg.onload = function(){
                countSpan.innerHTML = oP.style.width = Math.ceil(++loadedCount / imgCount * 100) + "%";
                //this.onload = null;   //加不加这一句都没差，对性能有影响吗？ 2016.12.02
                var temp = document.createElement("img");
                temp.src = this.src;
                aData[i] = temp;
                if(aData[i] && aData.length == imgCount){
                    ott.css(overlayDiv, "display", "none");
                    complete();
                }
            }
            aImg.src = allImg[i];
        })(i);
    }
};






















