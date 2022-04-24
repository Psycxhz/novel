<template>
	<view class="root" :style="{color:fontColor,background:background}">
		<view class="book-page">
			<view class="left" @click="backward"></view>
			<view class="center" @click="exhale"></view>
			<view class="right" @click="forward"></view>
		</view>
		<view class="list-content" v-if="isListShow">
			<view class="list-content-item" v-for="item in bookChapter.chapters" :key="item.id"
				@click="getBookcontent(item.link)">
				{{item.title}}
			</view>
		</view>
		<view class="contenText">
			<view class="contenText-title" v-show="bigflag">
				{{contentText.chapter.title}}
			</view>
			<view
			class="contenTextData"
			:style="{'font-size':size +'px'}"
			>
				<rich-text
				class="rich-text"
				:nodes="bookChaptersBody(contentText.chapter.cpContent)"
				>
				</rich-text>
				<rich-text
				class="rich-text-data"
				:style="{'transform': `translateX(${-leftX}px)`,'transition':undue}"
				:nodes="bookChaptersBody(contentText.chapter.cpContent)"
				>
				</rich-text>
			</view>
		</view>
		<view class="mint-header" v-if="isShow">
			<view class="header-l" @click="tofromone">
				<view class="span"></view> 返回
			</view>
			<view class="header-title">
				{{bookChapter.bookName}}
			</view>
			<view class="header-r"></view>
		</view>
		<view class="mint-footer" v-if="isShow">
			<view class="footer-text footer">
				<view class="footer-item" @click="fonSizeXl">
					Aa+
				</view>
				<view class="footer-item" @click="fonSizeL">
					Aa-
				</view>
			</view>
			<view class="footer-style footer">
				<view
				class="footer-item" 
				v-for="item in footerStyle" 
				:key="item.style" 
				:class="{'color':item.isShow}"
				@click="switchBack(item.style)"
				>
					{{item.style}}
				</view>
			</view>
			<view class="footer-info footer">
				<view class="footer-item" @click="addBookshelf">
					{{isBookShell ? "移出书架" : "加入书架"}}
				</view>
				<view class="footer-item">
					更换书源
				</view>
			</view>
			<view class="footer">
				<view class="footer-item" @click="getUpChapter">
					上一章
				</view>
				<view class="footer-item" @click="listshow">
					目录
				</view>
				<view class="footer-item" @click="getDownChapter">
					下一章
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pattern: [{
						item: '默认',
						color: '#5c5d58',
						background: '#eee6dd'
					},
					{
						item: '夜间',
						color: '#666',
						background: '#000'
					},
					{
						item: '护眼',
						color: '#5c5d58',
						background: '#c8e8c8'
					},
				],
				fontColor: '#5c5d58',
				footerStyle: [{
						style: "默认",
						isShow: true
					},
					{
						style: "夜间",
						isShow: false
					},
					{
						style: "护眼",
						isShow: false
					},
				],
				background: '#eee6dd',
				bookSources: [],
				bookChapter: {},
				color: '#5c5d58',
				size: 12,
				isShow: false,
				isListShow: false,
				contentText: {chapter:{cpContent:''}},
				flag:false,
				bigflag:false,
				leftX:0,
				numPage:0,
				dataH:0,
				isArticle:false,
				holderdataH:"92vh",
				numberPage:2,
				undue:"0.4s",
				defaultAddress:'',
				fromBookInfoLink:'',
				bookInfo:'',
				isBookShell:false
			};
		},
		onLoad(option) {
			this.getbook(option.id)
			this.getbookSources(option.id)
			const query = uni.createSelectorQuery().in(this)
			query.select(".contenTextData").boundingClientRect(data=>{
				this.dataH = Math.floor(data.height)
			}).exec()
			let bookStyle = JSON.parse(uni.getStorageSync("bookStyle") || "{}")
			let fontSize = JSON.parse(uni.getStorageSync("fontSize") || "{}")
			this.fontColor = bookStyle.fontColor
			this.background = bookStyle.background
			this.size = fontSize.size
			if(this.background){
				this.footerStyle.forEach(v=>{
					v.isShow = false
					if(v.style == bookStyle.item){
						v.isShow = true
					}
				})
			}
		},
		methods: {
			//切换背景
			switchBack(item){
				let localShelf = JSON.parse(uni.getStorageSync("bookStyle") || "{}")
				this.footerStyle.forEach(v=>{
					v.isShow = false
					if(v.style == item){
						v.isShow = true
					}
				})
				this.pattern.forEach(v=>{
					if(v.item == item){
						this.fontColor = v.color
						this.background = v.background
					}
				})
				localShelf = {
					item,
					fontColor:this.fontColor,
					background:this.background
				}
				uni.setStorageSync("bookStyle",JSON.stringify(localShelf))
			},
			//字体放大
			fonSizeXl(){
				let localShelf = JSON.parse(uni.getStorageSync("fontSize") || "{}")
				if(this.size >= 15){
					this.size = 15
				}else{
					++this.size
				}
				localShelf = {
					size:this.size
				}
				uni.setStorageSync("fontSize",JSON.stringify(localShelf))
			},
			//字体变小
			fonSizeL(){
				let localShelf = JSON.parse(uni.getStorageSync("fontSize") || "{}")
				if(this.size <= 12){
					this.size = 12
				}else{
					--this.size
				}
				localShelf = {
					size:this.size
				}
				uni.setStorageSync("fontSize",JSON.stringify(localShelf))
			},
			//加入书架
			addBookshelf(){
				let localShelf = JSON.parse(uni.getStorageSync("bookshelf") || "{}")
				if(this.isBookShell){
					delete localShelf[this.bookInfo._id];
					uni.setStorageSync("bookshelf",JSON.stringify(localShelf))
					this.isBookShell = !this.isBookShell
				}else{
					localShelf[this.bookInfo._id] = {
						...localShelf[this.bookInfo._id],
						cover:this.bookInfo.cover,
						id:this.bookInfo._id,
						title:this.bookInfo.title,
						isAdd:!this.isBookShell
					}
					uni.setStorageSync("bookshelf",JSON.stringify(localShelf))
					this.isBookShell = !this.isBookShell
				}
			},
			//获取书籍信息
			async getbook(id) {
				const {
					data
				} = await uni.$http.get(`/book/${id}`)
				this.bookInfo = data
				let bookshelf = JSON.parse(uni.getStorageSync("bookshelf") || "{}")
				if(bookshelf[this.bookInfo._id]){
					this.numPage = bookshelf[this.bookInfo._id].numPage
					this.leftX = bookshelf[this.bookInfo._id].leftX
					this.fromBookInfoLink = bookshelf[this.bookInfo._id].link
					this.isBookShell = bookshelf[this.bookInfo._id].isAdd
				}
			},
			//获取书籍源
			async getbookSources(id) {
				const {
					data
				} = await uni.$http.get(`/atoc/?view=summary&book=${id}`)
				this.bookSources = data
				this.getBookChapters(this.bookSources[0]._id)
			},
			//获取书籍章节(根据书籍源获取章节)
			async getBookChapters(id) {
				const {
					data
				} = await uni.$http.get(`/btoc/${id}?view=chapters&channel=mweb`)
				this.bookChapter = data
				this.getBookcontent(this.fromBookInfoLink ? this.fromBookInfoLink : this.bookChapter.chapters[0].link)
				this.bigflag = true
			},
			//判断是否渲染
			exhale() {
				this.isShow = this.isShow ? false : true
			},
			//获取上一章
			backward() {
				if (this.isShow) return this.isShow = false
				if(this.numPage <= 0 ){
					if(this.contentText.chapter.order == 1) return uni.$showMsg("前面没有章节了");
					this.undue = "0s"
					let link = this.bookChapter.chapters[this.contentText.chapter.order - 2].link
					this.getBookcontent(link)
					this.numPage = this.numberPage
					this.leftX = this.numberPage * this.holderdataH
				}else{
					--this.numPage
					this.leftX = this.holderdataH * this.numPage
				}
				this.getBookInfo()
			},
			//获取下一章
			forward() {
				if (this.isShow) return this.isShow = false
				if (this.isListShow) return this.isListShow = false
				if(this.numberPage == this.numPage){
					this.undue = "0s"
					let link = this.bookChapter.chapters[this.contentText.chapter.order].link
					this.getBookcontent(link)
					this.numPage = 0,
					this.leftX = 0
				}else{
					++this.numPage
					this.leftX = this.holderdataH * this.numPage
				}
				this.getBookInfo()
			},
			//切换上一章
			getUpChapter(){
				if(this.contentText.chapter.order == 1) return uni.$showMsg("前面没有章节了");
				this.undue = "0s"
				let link = this.bookChapter.chapters[this.contentText.chapter.order-2].link
				this.getBookcontent(link)
				this.numPage = 0,
				this.leftX = 0
			},
			//切换下一章
			getDownChapter(){
				this.undue = "0s"
				let link = this.bookChapter.chapters[this.contentText.chapter.order].link
				this.getBookcontent(link)
				this.numPage = 0,
				this.leftX = 0
			},
			//呼出目录
			listshow() {
				this.isListShow = this.isListShow ? false : true
				if (this.isShow) return this.isShow = false
			},
			//后退一下
			tofromone() {
				this.getBookInfo()
				uni.navigateBack({
					delta: 1
				})
			},
			getBookInfo(){
				let link = this.bookChapter.chapters[this.contentText.chapter.order - 1].link
				let localShelf = JSON.parse(uni.getStorageSync("bookshelf") || "{}")
				localShelf[this.bookInfo._id] = {
					...localShelf[this.bookInfo._id],
					link,
					leftX:this.leftX,
					numPage:this.numPage
				}
				uni.setStorageSync("bookshelf",JSON.stringify(localShelf))
			},
			//处理章节内容数据
			bookChaptersBody(books) {
				if (books) {
					let c = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
					let _book = JSON.stringify(books).replace(/^"|"$/g, '');
					if (c.test(_book)) {
						_book = '<p class = "text">' + _book.replace(/\s*/g, '').replace(/\\n/g, '</p><p class = "text">') + '</p>';
						const query = uni.createSelectorQuery().in(this)
						query.select(".rich-text").boundingClientRect(data=>{
							this.numberPage =  Math.floor(data.height / this.dataH)//计算页数
						}).exec()
						return _book
					}
				}
			},
			//获取章节内容
			async getBookcontent(link) {
				this.flag = false
				const [err, res] = await uni.request({
					url: `http://localhost:8081/content/chapter/${encodeURIComponent(link)}`,
				})
				this.contentText = res.data
				this.flag = true
				this.undue = "0.4s"
			},
		},
		onReady() {
			const query = uni.createSelectorQuery().in(this)
			query.selectViewport().boundingClientRect(data=>{
				this.holderdataH = data.width
			}).exec()
		}
	}
</script>

<style lang="scss">
	.root {
		min-height: 100vh;
		position: relative;
		height: 100%;
		width: 100%;
		border: 1px solid transparent;
		box-sizing: border-box;

		.mint-header {
			height: 40px;
			position: fixed;
			z-index: 2;
			top: 20px;
			color: #fff;
			font-size: 12px;
			background-color: rgba(0, 0, 0, 0.8);
			position: relative;
			line-height: 40px;
			display: flex;
			justify-content: space-around;

			.header-l {
				position: relative;

				.span {
					left: -40%;
					position: absolute;
					display: inline-block;
					border-top: 1px solid;
					border-left: 1px solid;
					height: 5px;
					top: 50%;
					transform: translateY(-50%) rotate(-45deg);
					width: 5px;
				}
			}
		}

		.mint-footer {
			position: fixed;
			padding: 10px;
			z-index: 2;
			bottom: 0;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.8);

			.footer-style {
				.color {
					border: 1px solid #409eff;
				}
			}

			.footer {
				margin-top: 10px;
				display: flex;
				justify-content: center;
			}

			.footer-item {
				margin-right: 5px;
				width: 100px;
				line-height: 30px;
				color: #fff;
				height: 30px;
				border-radius: 5px;
				border: 1px solid #fff;
				text-align: center;
			}
		}

		.book-page {
			position: absolute;
			width: 100%;
			display: flex;
			z-index: 1;
			height: 100%;
			min-height: 100vh;

			.left {
				width: 30%;
				height: 100%;
			}

			.center {
				width: 60%;
				height: 100%;
			}

			.right {
				width: 30%;
				height: 100%;
			}
		}

		.list-content {
			background-color: #fff;
			height: 92vh;
			z-index: 3;
			position: absolute;
			bottom: 0;
			width: 70%;
			overflow: auto;
			overflow-y: auto;

			.list-content-item {
				line-height: 2rem;
				margin-left: 1rem;
				border-bottom: 1px solid #e0e0e0;
				height: 2rem;
				font-size: 12px;
			}
		}
		.contenText {
			width: 100%;
			height: 92vh;
			position: absolute;
			bottom: 0;
			box-sizing: border-box;
			font-size: 12px;
			.contenTextData{
				display: inline-block;
				position: relative;
				width: 100%	;
				height: 88vh;
				bottom: 0;
				text-indent: 1.5em;
				box-sizing: border-box;
				overflow: hidden;
				line-height: 26px;
				.rich-text{
					width: 97%;
					display: inline-block;
					position: absolute;
					left: 0;
					z-index: -1;
					opacity: 0;
					padding: 0 10px;
					box-sizing: border-box;
					text-indent: 1.5em;
					.text{
						border: 1px solid transparent;
					}
				}
				.rich-text-data{
					width: 97%;
					height: 100%;
					position: absolute;
					columns: calc(100vw - 32px) 1;
					column-gap: 16px; 
					left: 0;
				}
			}
		}
	}
</style>
