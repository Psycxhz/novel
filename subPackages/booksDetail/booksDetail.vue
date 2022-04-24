<template>
	<view>
		<view class="book-detail">
			<view class="cover">
				<image :src="bookdata.cover" mode=""></image>
			</view>
			<view class="desc">
				<view class="h1">
					{{bookdata.title}}
				</view>
				<view class="info">
					{{bookdata.author}} | {{bookdata.cat}} | {{bookdata.wordCount}}万字
				</view>
				<view class="updata">
					{{bookdata.updated}}
				</view>
				<view class="updata">
					{{bookdata.lastChapter}}
				</view>
			</view>
		</view>
		<view class="read-link">
			<view class="sj" @click="modify">
				{{sj?"不追了":"追更新"}}
			</view>
			<view class="read" @click="toreadBook(bookdata._id,bookdata.title)">
				开始阅读
			</view>
		</view>
		<view class="reader-data">
			<view class="reader-data-item">
				<text class="key">追人气</text>
				<text>{{bookdata.latelyFollower}}万</text>
			</view>
			<view class="reader-data-item">
				<text class="key">读者存留率</text>
				<text>{{bookdata.retentionRatio}}</text>
			</view>
			<view class="reader-data-item">
				<text class="key">日更字数/天</text>
				<text>{{bookdata.serializeWordCount}}</text>
			</view>
		</view>
		<view class="introduction">
			<text>{{bookdata.longIntro}}</text>
		</view>
		<view class="comment">
			<view class="comment-title">
				热门评论	
			</view>
			<view class="comment-list" v-for="item in comment" :key = "item._id">
				<view class="comment-list-cover">
					<image :src="item.author.avatar" mode=""></image>
				</view>
				<view class="comment-list-r">
					<text class="comment-list-name">{{item.author.nickname}}</text>
					<text class="comment-list-title">{{item.title}}</text>
					<text class="comment-list-content">{{item.content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookdata:[],
				sj:false,
				comment:[]
			};
		},
		//获取到数据并进行布局
		onLoad(option) {
			this.getPage(option)
			this.getComments(option)
			//判读是否追书
			let localShelf = JSON.parse(uni.getStorageSync("book") || "{}")
			this.sj = !!(localShelf && localShelf[this.bookdata._id])
		},
		onReady() {
			uni.setNavigationBarTitle({
				title:"书籍详情"
			})
		},
		methods:{
			//判断追书
			modify(){
				//从本地获取书本信息
				let localShelf = JSON.parse(uni.getStorageSync("book") || "{}")
				if(this.sj){
					//没有追书得情况下进行删除
					delete localShelf[this.bookdata._id];
					uni.setStorageSync("book",JSON.stringify(localShelf))
					this.sj = !this.sj
				}else{
					//追书得情况下添加书本信息到本地
					localShelf[this.bookdata._id] = {
						cover:this.bookdata.cover,
						title:this.bookdata.title,
						id:this.bookdata._id
					}
					uni.setStorageSync("book",JSON.stringify(localShelf))
					this.sj = !this.sj
				}
			},
			//获取评论信息
			async getComments(option){
				const {data} = await uni.$http.get(`/post/review/best-by-book?book=${option.id}&limit=10`)
				this.comment = data.reviews
				//处理uniapp编码问题
				this.comment.forEach(v=>{
					v.author.avatar = 'http://statics.zhuishushenqi.com'+ decodeURIComponent(v.author.avatar)
				})
			},
			//获取小说信息
			async getPage(option){
				const {data}= await uni.$http.get("/book/"+option.id)
				//计算时间差
				this.bookdata = data
				let dated = new Date(this.bookdata.updated)
				let dateIng = new Date()
				this.bookdata.updated = dateIng.getTime() - dated.getTime()
				//设置时间
				if(Math.floor(this.bookdata.updated / (1000 * 3600 * 24 *365)) > 0){
					this.bookdata.updated = Math.floor(this.bookdata.updated / (1000 * 3600 * 24 *365)) + "年前更新"
				}else if(Math.floor(this.bookdata.updated / (1000 * 3600 * 24)) > 0){
					this.bookdata.updated = Math.floor(this.bookdata.updated / (1000 * 3600 * 24)) + "天前更新"
				}else{
					this.bookdata.updated = Math.floor(this.bookdata.updated / (1000 * 3600)) + "小时前更新"
				}
				//解决uniapp编码问题
				this.bookdata.cover = 'http://statics.zhuishushenqi.com'+ decodeURIComponent(this.bookdata.cover)
				this.bookdata.wordCount = parseInt(this.bookdata.wordCount / 10000)
				this.bookdata.latelyFollower = parseFloat(this.bookdata.latelyFollower / 10000).toFixed(1)
				this.bookdata.longIntro = this.bookdata.longIntro.replace(/\s*/g,"")
			},
			toreadBook(id,title){
				uni.navigateTo({
					url:"../readBook/readBook?id="+id+"&title="+title
				})
			}
		}
	}
</script>

<style lang="scss">
	.book-detail{
		width: 100%;
		display: flex;
		.cover{
			margin-top: 20px;
			margin-left: 20px;
			width: 100px;
			height: 100px;
			image{
				width: 90%;
				height: 100%;
			}
		}
		.desc{
			margin-top: 20px;
			color:rgb(153,153,153);
			font-size: 12px;
			.h1{
				color: #000000;
				font-size: 15px;
				font-weight: bold;
			}
			.info{
				margin-top: 7px;
			}
			.updata{
				margin-top: 7px;
			}
		}
	}
	.read-link{
		margin-top: 20px;
		width: 100%;
		justify-content: space-around;
		height: 50px;
		display: flex;
		flex: 1;
		.sj{
			width: 10rem;
			text-align: center;
			line-height: 50px;
			border: 1px solid rgb(64,158,255);
			color: rgb(64,158,255);
		}
		.read{
			width: 10rem;
			text-align: center;
			color: #fff;
			line-height: 50px;
			background-color: rgb(64,158,255);
		}
	}
	.reader-data{
		display: flex;
		height: 50px;
		margin-top: 15px;
		box-sizing: border-box;
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
		.reader-data-item{
			flex: 1;
			display: flex;
			flex-direction:column;
			font-size: 12px;
			text{
				margin-top: 5px;
				text-align: center;
			}
			.key{
				color: rgb(179,153,166);
			}
		}
	}
	.introduction{
		padding-top: 10px;
		padding-bottom: 10px;
		width: 100%;
		border-bottom: 1px solid #e0e0e0;
		font-size: 12px;
		color: rgb(179,153,166);
		text{
			display: block;
			width: 90%;
			line-height: 20px;
			margin: 0 auto;
		}
	}
	.comment{
		.comment-title{
			margin-left: 10px;
			margin-top: 10px;
			font-size: 13px;
		}
		.comment-list{
			margin-top: 20px;
			display: flex;
			padding-bottom: 10px;
			box-sizing: border-box;
			border-bottom: 1px solid #e0e0e0;
			.comment-list-cover{
				width: 20%;
				box-sizing: border-box;
				margin: 0px 0px 0px 10px;
				image{
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
			}
			.comment-list-r{
				width: 80%;
				box-sizing: border-box;
				font-size: 12px;
				.comment-list-name{
					color: rgb(179,153,166);
				}
				.comment-list-title{
					height: 20px;
					font-weight: bold;
				}
				.comment-list-content{
					line-height: 20px;
				}
				text{
					display: block;
				}
			}
		}
	}
</style>
