/**
 * Created by wangwenan on 2016/7/19.
 */

var p_size = 10;
var old_page;
var old_select_index = -1;
var total_page;             //total page
var max_length = 3;         //max visible page number
var length = max_length;    //visible page number

function initCurrentPage(total, page, _max_Length) {     //init pagination
    if (total < page) {
        alert("error：current_page>total_page");
        console.log("error：current_page>total_page");
        return;
    }
    total_page = total;
    max_length = _max_Length;
    length = max_length;
    if (total < length) {
        length = total;
    }
    var li  = "<li onclick=\"selectOtherPage(this);\"><a class=\"selected_page\" href=\"#\">1</a></li>";
    var page_li = "";
    for(var i = 0; i < length; i++) {   //fill <li>
        page_li += li;
    }
    $('.pagination').find('li:eq(1)').after(page_li);

    initCurrPageHelper(page);
}

function initCurrPageHelper(page) {
    old_page = page;
    if (page == 1) {
        addHeadDisabled();
    }
    if (page == total_page) {
        addTailDisabled();
    }
    if (total_page < max_length) {      //总页数比原始可见页数小
        console.log("total_page<maxlength");
        old_select_index = page + 1;
        $('.pagination li:eq(' + old_select_index + ')>a').addClass("active");
        setPageNum(1, 2, 1);
    }
    else if (page <= Math.ceil(length / 2)) {  //选中页在可见页左侧
        console.log("init: left");
        old_select_index = page + 1;
        $('.pagination li:eq(' + old_select_index + ')>a').addClass("active");
        setPageNum(1, 2, 1);
    }
    else if (total_page - page + 1 <= Math.ceil(length / 2)) {   //选中页在可见页右侧
        console.log("init: right");
        old_select_index = length + 1 - (total_page - page);
        $('.pagination li:eq(' + old_select_index + ')>a').addClass("active");
        setPageNum(total_page, length + 1, 2);
    }
    else {   //选中页在可见页正中间，若length为偶数，则将length/2视为中间页码
        console.log("init: middle");
        old_select_index = Math.ceil(length / 2) + 1;
        $('.pagination li:eq(' + old_select_index + ')>a').addClass("active");
        if (length % 2 == 1) {
            setPageNum(page - Math.floor(length / 2), 2, 1);
        }
        else {
            setPageNum(page - Math.floor(length / 2) + 1, 2, 1);
        }
    }
}

function setPageNum(start_num, start_index, tag) {  //tag: 1--> 从左往右赋值, 2--> 从右往左赋值
    var num = start_num;
    var index = start_index;
    for(var i = 0; i < length; i++) {
        $('.pagination li:eq(' + index + ')>a').text(num);
        if(tag == 1) {
            num++;
            index++;
        }
        else {
            num--;
            index--;
        }
    }
}

function jumpToHead() {
    //alert("jumpTohead--->page:" + old_page + " old_index:" + old_select_index + " total_page:" + total_page);
    old_select_index = 2;
    $('.pagination li:eq(2)>a').addClass("active");
    addHeadDisabled();
    setPageNum(1, 2, 1);
}

function jumpToTail() {
    //alert("jumpToTail--->page:" + old_page + " old_index:" + old_select_index + " total_page:" + total_page);
    var selected_index = 2 + length - 1;
    old_select_index = selected_index;
    $('.pagination li:eq(' + selected_index + ')>a').addClass("active");
    addTailDisabled();
    setPageNum(total_page, length + 1, 2);
}

function jumpToHeadOrTail(tag) {  //tag:1->前跳, 2->后跳
    switch (tag) {
        case 1:
            if (old_page == 1) return;
            $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
            jumpToHead();
            removeTailDisabled();
            old_page = 1;
            break;
        case 2:
            if (old_page == total_page) return;
            $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
            jumpToTail();
            removeHeadDisabled();
            old_page = total_page;
            break;
        default:
            break;
    }
}

function addHeadDisabled() {
    $('.pagination').find('li:eq(0)').addClass("disabled");
    //$('.pagination').find('li:eq(0)').unbind("click", jumpToHeadOrTail);
    $('.pagination').find('li:eq(1)').addClass("disabled");
    //$('.pagination').find('li:eq(1)').unbind("click", jumpOnePage);
}
function addTailDisabled() {
    $('.pagination').find('li:last').addClass("disabled");
    //$('.pagination').find('li:last').unbind("click", jumpToHeadOrTail);
    $('.pagination').find('li:nth-last-child(2)').addClass("disabled");
    //$('.pagination').find('li:nth-last-child(2)').unbind("click", jumpOnePage);
}
function removeTailDisabled() {
    $('.pagination').find('li:last').removeClass("disabled");
    //$('.pagination').find('li:last').click(function () {
    //    jumpToHeadOrTail(2);
    //});
    $('.pagination').find('li:nth-last-child(2)').removeClass("disabled");
    //$('.pagination').find('li:nth-last-child(2)').click(function () {
    //    jumpOnePage(2);
    //});
}
function removeHeadDisabled() {
    $('.pagination').find('li:eq(0)').removeClass("disabled");
    //$('.pagination').find('li:eq(0)').click(function () {
    //    jumpToHeadOrTail(1);
    //});
    $('.pagination').find('li:eq(1)').removeClass("disabled");
    //$('.pagination').find('li:eq(1)').click(function () {
    //    jumpOnePage(1);
    //});
}

function jumpOnePage(tag) {    //tag:1->previous, 2->next
    //alert("jumpOnePage:---> old_page:" + old_page + " old_index:" + old_select_index + " total_page:" + total_page);
    switch (tag) {
        case 1:
            if (old_page == 1) return;
            var rightNum = length%2==1 ? total_page - old_page + 1 : total_page - old_page;
            if (total_page <= max_length || old_page <= Math.ceil(length / 2) || rightNum < Math.ceil(length / 2)) { //总页数比最大可见页数小或者当前为正中页两侧
                console.log("jumpOnePage: two side");
                $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
                var selected_index = --old_select_index;
                $('.pagination li:eq(' + selected_index + ')>a').addClass("active");
            }
            else {          //当前页为可见页的正中页
                console.log("jumpOnePage: middle");
                if(length%2 == 1) {
                    setPageNum(old_page - 1 - Math.floor(length / 2), 2, 1);
                }
                else {
                    setPageNum(old_page - 1 - Math.floor(length / 2) + 1, 2, 1);
                }
            }
            if(old_page == 2) addHeadDisabled();
            if(old_page == total_page) removeTailDisabled();
            old_page--;
            break;
        case 2:
            if (old_page == total_page) return;
            var rightNum = length%2==1 ? total_page - old_page + 1 : total_page - old_page;
            if (total_page <= max_length || old_page < Math.ceil(length / 2) || rightNum <= Math.ceil(length / 2)) { //总页数比最大可见页数小或者当前为正中页两侧
                console.log("jumpOnePage: two side");
                $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
                var selected_index = ++old_select_index;
                $('.pagination li:eq(' + selected_index + ')>a').addClass("active");
            }
            else {
                console.log("jumpOnePage: middle");
                if(length%2 == 1) {
                    setPageNum(old_page + 1 - Math.floor(length / 2), 2, 1);
                }
                else {
                    setPageNum(old_page + 1 - Math.floor(length / 2) + 1, 2, 1);
                }
            }
            if(old_page == total_page - 1) addTailDisabled();
            if(old_page == 1) removeHeadDisabled();
            old_page++;
            break;
        default:
            break;
    }
}

function selectOtherPage(obj) {
    //alert("selectPage--->old_page:" + old_page + " old_index:" + old_select_index + " total_page:" + total_page);
    var page = $(obj).find('a').text();
    var pageInt = parseInt(page);
    var index = $(obj).prevAll().length;

    if(old_page == 1) removeHeadDisabled();
    if(old_page == total_page) removeTailDisabled();

    if (pageInt == 1) {
        $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
        $('.pagination li:eq(' + index + ')>a').addClass("active");
        jumpToHead();
    }
    else if (pageInt == total_page) {
        $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
        $('.pagination li:eq(' + index + ')>a').addClass("active");
        jumpToTail();
    }
    else if(total_page <= max_length) {   //总页数比原始可见页数小
        console.log("total_page<maxlength");
        $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
        old_select_index = pageInt + 1;
        $('.pagination li:eq(' + index + ')>a').addClass("active");
    }
    else if(pageInt <= Math.ceil(length / 2)) {  //选中页在可见页左侧
        console.log("init: left");
        $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
        old_select_index = pageInt + 1;
        $('.pagination li:eq(' + old_select_index + ')>a').addClass("active");
        setPageNum(1, 2, 1);
    }
    else if(total_page - pageInt  + 1 <= Math.ceil(length / 2)) {   //选中页在可见页右侧
        console.log("init: right");
        $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
        old_select_index = length + 1 - (total_page - pageInt);
        $('.pagination li:eq(' + old_select_index + ')>a').addClass("active");
        setPageNum(total_page, length + 1, 2);
    }
    else {   //选中页在可见页正中间，若length为偶数，则将length/2视为中间页码
        console.log("init: middle");
        $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
        old_select_index = Math.ceil(length / 2) + 1;
        $('.pagination li:eq(' + old_select_index + ')>a').addClass("active");
        if(length%2 == 1) {
            setPageNum(pageInt - Math.floor(length / 2), 2, 1);
        }
        else {
            setPageNum(pageInt - Math.floor(length / 2) + 1, 2, 1);
        }
    }
    old_page = pageInt;
}

function gotoOnePage() {
    if($('input#page_number').val() == '') {
        alert("页码为空！");
        return;
    }
    var page = parseInt($('input#page_number').val());
    if(page > total_page) {
        alert("跳转页不存在！");
        return;
    }
    if(page <= 0) {
        alert("跳转页为负数！");
        return;
    }
    $('.pagination li:eq(' + old_select_index + ')>a').removeClass("active");
    initCurrPageHelper(page);
    if(page != 1) removeHeadDisabled();
    if(page != total_page) removeTailDisabled();
}

