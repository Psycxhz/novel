<template>
	<view>
		<view class="boy">
			<view class="category-title">
				男频
			</view>
			<view class="type">
				<view class="grid" v-for="item in male" :key = "item.name" @click="toBooksType(item.name,'male')">
					<view class="type-title">{{item.name}}</view>
					<view class="count">{{item.bookCount}}</view>
				</view>
			</view>
		</view>
		<view class="girl">
			<view class="category-title">
				女频
			</view>
			<view class="type">
				<view class="grid" v-for="item in female" :key = "item.name" @click="toBooksType(item.name,'female')">
					<view class="type-title">{{item.name}}</view>
					<view class="count">{{item.bookCount}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				male:[],
				female:[]
			};
		},
		methods:{
			async getBooksType(){
				const {data} =await uni.$http.get("/cats/lv2/statistics")
				this.male = data.male
				this.female = data.female
			},
			toBooksType(item,sex){
				uni.navigateTo({
					url:"../../subPackages/booksListType/booksListType?name="+item+"&sex="+sex
				})
			}
		},
		created(){
			this.getBooksType()
		}
	}
</script>

<style lang="scss">
	.category-title{
		font-size: 13px;
		padding: 15px 0 15px 10px;
		border-bottom: 1px solid #E0e0e0;
	}
	.type{
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		.grid{
			flex: 1;
			width: 33.3333333%;
			max-width: 33.3333333%;
			min-width: 33.3333333%;
			padding: 0.266667rem;
			height: 50px;
			box-sizing: border-box;
			border-top: 0.013333rem solid #f8f8f8;
			border-right: 0.013333rem solid #f8f8f8;
			border-bottom: 0.013333rem solid #f8f8f8;
			.type-title{
				font-size: 13px;
				font-weight: bold;
				text-align: center;
			}
			.count{
				font-size: 12px;
				text-align: center;
				color: #E0e0e0;
			}
		}
	}

</style>
