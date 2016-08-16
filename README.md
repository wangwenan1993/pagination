# wangwenan.pagination

jquery 分页插件

引入文件：

	<link href="css/bootstrap.css" rel="stylesheet"> # bootstrap是一个开源的css插件
	<link href="css/pagination.css" rel="stylesheet">

	<script src="js/jquery-1.10.2.js"></script>
	<script src="js/pagination.js"></script>

初始化插件：

	pagination.init(3, 10); # 设置最大可显示页数，可以为奇数也可以为偶数；设置每页显示的条目数
	
动作函数：

	pagination.initCurrentPage(total, page)
	# 初始化总页数和当前页数

	pagination.jumpToHead()
	# 跳到第一页

	pagination.jumpToTail()
	# 跳到最后一页

	pagination.jumpOnePage(tag)
	# tag -> 0: 前一页
		 1: 后一页

	pagination.selectOtherPage(obj)
	# 跳转到当前点击的页数

	pagination.gotoOnePage()
	# 跳转到指定的页数

最终效果：

1.可见页为奇数：

	![image](https://github.com/wangwenan1993/pagination/blob/master/screenshoot/visiable_page=3.png)

2.可见页为偶数：

	![image](https://github.com/wangwenan1993/pagination/blob/master/screenshoot/visiable_page=2.png)

3.总页数=2 < 可见页数=3

	![image](https://github.com/wangwenan1993/pagination/blob/master/screenshoot/total_page=3-visiable_page=3.png)



