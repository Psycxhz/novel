<template>
	<view class="root">
		<view class="root-item">
			<view class="title">
				男生
			</view>
			<view class="root-item-sort" v-for="item in boySort" :key = "item._id" @click="toSortDetails('male',item._id)">
				<image :src="item.cover" mode=""></image>
				<view class="topName">
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="root-item">
			<view class="title">
				女生
			</view>
			<view class="root-item-sort" v-for="item in girySort" :key = "item._id" @click="toSortDetails('female',item._id)">
				<image :src="item.cover" mode=""></image>
				<view class="topName">
					{{item.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				boySort:[],
				girySort:[]
			};
		},
		methods:{
			async getBookSort(){
				const {data} = await uni.$http.get('/ranking/gender')
				console.log(data);
				this.boySort = data.male.splice(0,6)
				this.girySort = data.female.splice(0,7)
				this.boySort.splice(3,1)
				this.girySort.splice(4,1)
				this.boySort.forEach(v=>{
					v.cover = "http://statics.zhuishushenqi.com" + v.cover
				})
				this.girySort.forEach(v=>{
					v.cover = "http://statics.zhuishushenqi.com" + v.cover
				})
				console.log(this.boySort);
				console.log(this.girySort);
			},
			toSortDetails(item,id){
				console.log(item,id);
				uni.navigateTo({
					url:"../../subPackages/sortDetails/sortDetails?male="+item+"&id="+id
				})
			}
		},
		onReady() {
			this.getBookSort()
		}
	}
</script>

<style lang="scss">
	.root-item{
		.title{
			font-size: 12px;
			margin: 1rem;
		}
		.root-item-sort{
			display: flex;
			width: 100%;
			height: 3rem;
			align-items: center;
			image{
				margin-left: 1rem;
				width: 2rem;
				height: 50%;
			}
			.topName{
				margin-left: 1rem;
				font-size: 13px;
			}
		}
	}
</style>
