<template>
	<view>
		<view class="bookList">
			<view class="book" v-for="item in bookList" :key = "item.id" @click="toRead(item.id,item.title)">
				<image :src="item.cover" mode=""></image>
				<view class="title">
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="nav" v-if = "isShow" @click="toRanking">
			还没收藏？去逛逛把！
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:true,
				bookList:[]
			};
		},
		methods:{
			toRanking(){
				uni.switchTab({
					url:"/pages/ranking/ranking"
				})
			},
			toRead(id,title){
				uni.navigateTo({
					url:"../../subPackages/readBook/readBook?id="+id+"&title="+title
				})
			},
			initialization(){
				let localShelf = JSON.parse(uni.getStorageSync("bookshelf") || "{}")
				this.bookList = []
				for(let key in localShelf){
					if(localShelf[key].isAdd){
						this.bookList.push(localShelf[key])
					}
				}
				this.bookList.forEach(v=>{
					v.cover ='http://statics.zhuishushenqi.com'+ decodeURIComponent(v.cover)
				})
				if(this.bookList.length){
					this.isShow = false
				}
			}
		},
		onShow(){
			this.initialization()
		},
		onReady() {
			this.initialization()
		}
	}
</script>

<style lang="scss">
	.nav{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		font-size: 13px;
	}
	.bookList{
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		margin-left: 2rem;
		.book{
			width: 7.1rem;
			height: 8rem;
			margin-top: 1rem;
			box-sizing: border-box;
			image{
				width: 80%;
				height: 90%;	
			}
			.title{
				width: 80%;
				text-align: center;
			}
		}
	}

</style>
