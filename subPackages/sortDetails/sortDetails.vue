<template>
	<view class="root">
		<view class="header">
			<view 
			class="header-item" 
			v-for="item in listData" 
			:key = "item.name" 
			:class="{'cbor':item.isShow}"
			@click="changeData(item.name)"
			>
				{{item.name}}
			</view>
		</view>
		<view class="top">
			<view v-for="item in booksList" :key="item._id" @click="toBookdetail(item._id)">
				<books :bookInfo="item"></books>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData:[
					{
						name:'周榜',
						isShow:true,						
					},
					{
						name:'月榜',
						isShow:false,
					},
					{
						name:'总榜',
						isShow:false
					}
				],
				booksList:[],
			};
		},
		methods:{
			changeData(item){
				this.listData.forEach(v=>{
					v.isShow = false
					if(v.name == item){
						v.isShow = true
					}
				})
			},
			async getData(id){
				const {data} = await uni.$http.get(`/ranking/${id}`)
				console.log(data);
				this.booksList = data.ranking.books
				this.booksList.forEach(v=>{
					v.cover ="http://statics.zhuishushenqi.com"+decodeURIComponent(v.cover)
					v.latelyFollower = parseFloat(v.latelyFollower / 10000).toFixed(1)
				})
				uni.setNavigationBarTitle({
					title:data.ranking.title
				})
			},
			toBookdetail(id){
				uni.navigateTo({
					url:"../booksDetail/booksDetail?id="+id
				})
			}
		},
		onLoad(option) {
			console.log(option);
			this.getData(option.id)
		}
	}
</script>

<style lang="scss">
	.header{
		display: flex;
		align-items: center;
		.header-item{
			text-align: center;
			flex: 1;
			height: 2rem;
			border: 1px solid transparent;
			line-height: 2rem;
		}
		.cbor{
			color: rgb(64,158,255);
			border-bottom:1px solid rgb(64,158,255);
		}
	}
</style>
