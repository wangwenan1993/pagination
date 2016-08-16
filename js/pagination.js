/**
 * Created by wangwenan on 2016/7/19.
 */

var pagination = {
    p_size: 10,                //message num per page
    old_page: -1,              //selected page num
    old_select_index: -1,      //selected page index of nav ul
    total_page: 0,             //total page
    max_length: 3,             //max visible page number
    length: 3,        //visible page number

    init: function(_max_length, _p_size){
        pagination.p_size = _p_size;
        pagination.max_length = _max_length;
        pagination.length = pagination.max_length;
    },

    initCurrentPage: function(total, page) {     //init pagination
        if (total < page) {
            alert("error：current_page>total_page");
            console.log("error：current_page>total_page");
            return;
        }
        pagination.total_page = total;
        if (total < pagination.length) {
            pagination.length = total;
        }
        var li  = "<li onclick=\"pagination.selectOtherPage(this);\"><a class=\"selected_page\" href=\"#\">1</a></li>";
        var page_li = "";
        for(var i = 0; i < pagination.length; i++) {   //fill <li>
            page_li += li;
        }
        $('.pagination').find('li:eq(1)').after(page_li);

        pagination.initCurrPageHelper(page);
    },

    initCurrPageHelper: function(page) {
        pagination.old_page = page;
        if (page == 1) {
            pagination.addHeadDisabled();
        }
        if (page == pagination.total_page) {
            pagination.addTailDisabled();
        }
        if (pagination.total_page < pagination.max_length) {      //总页数比原始可见页数小
            console.log("total_page<maxlength");
            pagination.old_select_index = page + 1;
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').addClass("active");
            pagination.setPageNum(1, 2, 1);
        }
        else if (page <= Math.ceil(pagination.length / 2)) {  //选中页在可见页左侧
            console.log("init: left");
            pagination.old_select_index = page + 1;
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').addClass("active");
            pagination.setPageNum(1, 2, 1);
        }
        else if (pagination.total_page - page + 1 <= Math.ceil(pagination.length / 2)) {   //选中页在可见页右侧
            console.log("init: right");
            pagination.old_select_index = pagination.length + 1 - (pagination.total_page - page);
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').addClass("active");
            pagination.setPageNum(pagination.total_page, pagination.length + 1, 2);
        }
        else {   //选中页在可见页正中间，若length为偶数，则将length/2视为中间页码
            console.log("init: middle");
            pagination.old_select_index = Math.ceil(pagination.length / 2) + 1;
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').addClass("active");
            if (pagination.length % 2 == 1) {
                pagination.setPageNum(page - Math.floor(pagination.length / 2), 2, 1);
            }
            else {
                pagination.setPageNum(page - Math.floor(pagination.length / 2) + 1, 2, 1);
            }
        }
    },

    setPageNum: function(start_num, start_index, tag) {  //tag: 1--> 从左往右赋值, 2--> 从右往左赋值
        var num = start_num;
        var index = start_index;
        for(var i = 0; i < pagination.length; i++) {
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
    },

    jumpToHead: function() {
        //alert("jumpTohead--->page:" + pagination.old_page + " old_index:" + pagination.old_select_index + " total_page:" + pagination.total_page);
        pagination.old_select_index = 2;
        $('.pagination li:eq(2)>a').addClass("active");
        pagination.addHeadDisabled();
        pagination.setPageNum(1, 2, 1);
    },

    jumpToTail: function() {
        //alert("jumpToTail--->page:" + pagination.old_page + " old_index:" + pagination.old_select_index + " total_page:" + pagination.total_page);
        var selected_index = 2 + pagination.length - 1;
        pagination.old_select_index = selected_index;
        $('.pagination li:eq(' + selected_index + ')>a').addClass("active");
        pagination.addTailDisabled();
        pagination.setPageNum(pagination.total_page, pagination.length + 1, 2);
    },

    jumpToHeadOrTail: function(tag) {  //tag:1->前跳, 2->后跳
        switch (tag) {
            case 1:
                if (pagination.old_page == 1) return;
                $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
                pagination.jumpToHead();
                pagination.removeTailDisabled();
                pagination.old_page = 1;
                break;
            case 2:
                if (pagination.old_page == pagination.total_page) return;
                $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
                pagination.jumpToTail();
                pagination.removeHeadDisabled();
                pagination.old_page = pagination.total_page;
                break;
            default:
                break;
        }
    },

    addHeadDisabled: function() {
        $('.pagination').find('li:eq(0)').addClass("disabled");
        $('.pagination').find('li:eq(1)').addClass("disabled");
    },
    addTailDisabled: function() {
        $('.pagination').find('li:last').addClass("disabled");
        $('.pagination').find('li:nth-last-child(2)').addClass("disabled");
    },
    removeTailDisabled: function() {
        $('.pagination').find('li:last').removeClass("disabled");
        $('.pagination').find('li:nth-last-child(2)').removeClass("disabled");
    },
    removeHeadDisabled: function() {
        $('.pagination').find('li:eq(0)').removeClass("disabled");
        $('.pagination').find('li:eq(1)').removeClass("disabled");
    },

    jumpOnePage: function(tag) {    //tag:1->previous, 2->next
        //alert("jumpOnePage:---> old_page:" + pagination.old_page + " old_index:" + pagination.old_select_index + " total_page:" + pagination.total_page);
        var rightNum = pagination.length%2==1 ? pagination.total_page - pagination.old_page + 1 : pagination.total_page - pagination.old_page;
        switch (tag) {
            case 1:
                if (pagination.old_page == 1) return;
                if (pagination.total_page <= pagination.max_length || pagination.old_page <= Math.ceil(pagination.length / 2) || rightNum < Math.ceil(pagination.length / 2)) { //总页数比最大可见页数小或者当前为正中页两侧
                    console.log("jumpOnePage: two side");
                    $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
                    var selected_index = --pagination.old_select_index;
                    $('.pagination li:eq(' + selected_index + ')>a').addClass("active");
                }
                else {          //当前页为可见页的正中页
                    console.log("jumpOnePage: middle");
                    if(pagination.length%2 == 1) {
                        pagination.setPageNum(pagination.old_page - 1 - Math.floor(pagination.length / 2), 2, 1);
                    }
                    else {
                        pagination.setPageNum(pagination.old_page - 1 - Math.floor(pagination.length / 2) + 1, 2, 1);
                    }
                }
                if(pagination.old_page == 2) pagination.addHeadDisabled();
                if(pagination.old_page == pagination.total_page) pagination.removeTailDisabled();
                pagination.old_page--;
                break;
            case 2:
                if (pagination.old_page == pagination.total_page) return;
                if (pagination.total_page <= pagination.max_length || pagination.old_page < Math.ceil(pagination.length / 2) || rightNum <= Math.ceil(pagination.length / 2)) { //总页数比最大可见页数小或者当前为正中页两侧
                    console.log("jumpOnePage: two side");
                    $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
                    var selected_index = ++pagination.old_select_index;
                    $('.pagination li:eq(' + selected_index + ')>a').addClass("active");
                }
                else {
                    console.log("jumpOnePage: middle");
                    if(pagination.length%2 == 1) {
                        pagination.setPageNum(pagination.old_page + 1 - Math.floor(pagination.length / 2), 2, 1);
                    }
                    else {
                        pagination.setPageNum(pagination.old_page + 1 - Math.floor(pagination.length / 2) + 1, 2, 1);
                    }
                }
                if(pagination.old_page == pagination.total_page - 1) pagination.addTailDisabled();
                if(pagination.old_page == 1) pagination.removeHeadDisabled();
                pagination.old_page++;
                break;
            default:
                break;
        }
    },

    selectOtherPage: function(obj) {
        //alert("selectPage--->old_page:" + pagination.old_page + " old_index:" + pagination.old_select_index + " total_page:" + pagination.total_page);
        var page = $(obj).find('a').text();
        var pageInt = parseInt(page);
        var index = $(obj).prevAll().length;

        if(pagination.old_page == 1) pagination.removeHeadDisabled();
        if(pagination.old_page == pagination.total_page) pagination.removeTailDisabled();

        if (pageInt == 1) {
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
            $('.pagination li:eq(' + index + ')>a').addClass("active");
            pagination.jumpToHead();
        }
        else if (pageInt == pagination.total_page) {
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
            $('.pagination li:eq(' + index + ')>a').addClass("active");
            pagination.jumpToTail();
        }
        else if(pagination.total_page <= pagination.max_length) {   //总页数比原始可见页数小
            console.log("total_page<maxlength");
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
            pagination.old_select_index = pageInt + 1;
            $('.pagination li:eq(' + index + ')>a').addClass("active");
        }
        else if(pageInt <= Math.ceil(pagination.length / 2)) {  //选中页在可见页左侧
            console.log("init: left");
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
            pagination.old_select_index = pageInt + 1;
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').addClass("active");
            pagination.setPageNum(1, 2, 1);
        }
        else if(pagination.total_page - pageInt  + 1 <= Math.ceil(pagination.length / 2)) {   //选中页在可见页右侧
            console.log("init: right");
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
            pagination.old_select_index = pagination.length + 1 - (pagination.total_page - pageInt);
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').addClass("active");
            pagination.setPageNum(pagination.total_page, pagination.length + 1, 2);
        }
        else {   //选中页在可见页正中间，若length为偶数，则将length/2视为中间页码
            console.log("init: middle");
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
            pagination.old_select_index = Math.ceil(pagination.length / 2) + 1;
            $('.pagination li:eq(' + pagination.old_select_index + ')>a').addClass("active");
            if(pagination.length%2 == 1) {
                pagination.setPageNum(pageInt - Math.floor(pagination.length / 2), 2, 1);
            }
            else {
                pagination.setPageNum(pageInt - Math.floor(pagination.length / 2) + 1, 2, 1);
            }
        }
        pagination.old_page = pageInt;
    },

    gotoOnePage: function() {
        if($('input#page_number').val() == '') {
            alert("页码为空！");
            return;
        }
        var page = parseInt($('input#page_number').val());
        if(page > pagination.total_page) {
            alert("跳转页不存在！");
            return;
        }
        if(page <= 0) {
            alert("跳转页为负数！");
            return;
        }
        $('.pagination li:eq(' + pagination.old_select_index + ')>a').removeClass("active");
        pagination.initCurrPageHelper(page);
        if(page != 1) pagination.removeHeadDisabled();
        if(page != pagination.total_page) pagination.removeTailDisabled();
    },
};
