<template>
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in banner" :key = "index">
				<image class="image" :src="item" mode="图片加载失败"></image>
			</swiper-item>
		</swiper>
		<view class="search">
			<uni-search>
				<uni-search-bar :placeholder="searchHotWords" @input="search" v-model="query"></uni-search-bar>
			</uni-search>
		</view>
		<view class="result" v-if="searchResult.length">
			<view class="result-item" v-for="(item, i) in searchResult" :key = "i" @click="goBooksDetail(item)">
				<view class="books-name">{{item}}</view>
			</view>
		</view>
		<view class="hotbook">
			<view class="h2">
				热门推荐
			</view>
			<view v-for="item in booksList" :key="item._id" @click="toBookdetail(item._id)">
				<books :bookInfo="item"></books>
			</view>
			<view class="more" @click="getMore">
				查看更多
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banner: [
				  'http://statics.zhuishushenqi.com/recommendPage/15313940968984',
				  'http://statics.zhuishushenqi.com/recommendPage/153139416791777',
				  'http://statics.zhuishushenqi.com/recommendPage/153139401503529',
				  'http://statics.zhuishushenqi.com/recommendPage/153139406636473'
				  ],
				query:"",
				searchHotWords:null,
				searchResult:[],
				booksList:[]
			};
		},
		methods:{
			async search(){
				let query = this.query
				const {data} = await uni.$http.get("/book/auto-complete",{
					query
				})
				this.searchResult = data.keywords
			},
			hotword(){
				uni.$http.get("/book/search-hotwords")
				.then((res)=>{
					if(res.data.searchHotWords.length){
						this.searchHotWords = res.data.searchHotWords[Math.floor(Math.random()*res.data.searchHotWords.length)].word
					}else{
						this.searchHotWords = "暂时没有热搜"
					}
					
				})
			},
			goBooksDetail(bookName){
				uni.navigateTo({
					url:"/subPackages/booksDetail/booksDetail?books_id="+bookName
				})
			},
			getMore(){
				uni.switchTab({
					url:"/pages/ranking/ranking"
				})
			},
			async getBookSort(){
				const {data} = await uni.$http.get("/book/by-categories?gender=male&type=hot&major=奇幻&minor=&start=0&limit=20")
				const res = await uni.$http.get("/ranking/54d43437d47d13ff21cad58b")
				this.booksList = data.books;
				this.booksList.forEach(v=>{
					v.cover ='http://statics.zhuishushenqi.com'+ decodeURIComponent(v.cover)
					v.latelyFollower = parseFloat(v.latelyFollower / 10000).toFixed(1)
				})
			},
			toBookdetail(id){
				uni.navigateTo({
					url:"../../subPackages/booksDetail/booksDetail?id="+id
				})
			}
		},
		created() {
			this.hotword()
			this.getBookSort()
		}
	}
</script>

<style lang="scss">
	.image{
		width: 100%;
		height: 100%;
	}
	.result{
		width: 100%;
		.result-item{
			padding: 5px 0 5px 6px;
			border-bottom: 1px solid #f8f8f8;
			display: flex;
			.books-name{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 12px;
				color: #3f3f3f;
			}
		}
	}
	.hotbook{
		.h2{
			font-size: 15px;
			padding: 0px 0px 0px 5px;
			font-weight: bold;
			border-left: 3px solid rgb(64,158,255);
			margin-bottom: 10px;
		}
		.more{
			font-size: 12px;
			display: inline-block;
			color: red;
			border-bottom: 1px double red;
		}
	}
</style>
