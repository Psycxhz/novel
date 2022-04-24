<template>
	<view >
		<view class="header">
			<view class="type">
				<text
				 v-for="item in headnav" 
				 :class="{'color':item.isActive}"
				 :key = "item.name"
				 @click="getdata(item)"
				 >
				 {{item.name}}
				 </text>
			</view>
			<view class="typeSmall">
				<view class="scllo" :style="{width:width+'px'}">
					<text
					 v-for="item in smallType" 
					 :class="{'color':item.isActive}"
					 :key = "item.name"
					 @click="getdataSmallType(item)"
					 >
					 {{item.name}}
					 </text>
				</view>
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
				apiInfo:{
					gender:'male',
					type:'hot',
					major:"奇幻",
					minor:'',
					start:0,
					limit:20
				},
				headnav:[
					{
						name:"热门",
						type:"hot",
						isActive:true
					},
					{
						name:"新书",
						type:"new",
						isActive:false
					},
					{
						name:"好评",
						type:"reputation",
						isActive:false
					},
					{
						name:"完结",
						type:"over",
						isActive:false
					}
				],
				smallType:[
					{
						name:"全部",
						isActive:true
					},
				],
				booksList:[],
				width:"400"
			};
		},
		//获取路由参数
		onLoad:async function(Option){
			this.apiInfo.gender = Option.sex
			this.apiInfo.major = Option.name
			uni.setNavigationBarTitle({
				title:Option.name
			})
			//获取分类
			const {data} = await uni.$http.get("/cats/lv2")
			if(Option.sex == "male"){
				//处理男频信息
				data.male.forEach(v=>{
					//处理uniapp的路由问题
					if(v.major == decodeURIComponent(Option.name) ){
						v.mins.forEach(i=>{
							this.smallType.push({
								name:i,
								isActive:false
							})
						})
					}
				})
			}else{
				//处理女频信息
				data.female.forEach(v=>{
					if(v.major == decodeURIComponent(Option.name) ){
						v.mins.forEach(i=>{
							this.smallType.push({
								name:i,
								isActive:false
							})
						})
					}
				})
			}
			this.width = this.smallType.length*65.72
			this.getbooksList()
		},
		methods:{
			//动态修改class以及大分类
			getdata(item){
				this.headnav.forEach(v=>{
					v.isActive = false
					if(v.name == item.name){
						v.isActive = true
					}
				})
				this.apiInfo.type = item.type
				this.getbooksList()
			},
			//动态修改class以及小分类值
			getdataSmallType(item){
				this.smallType.forEach(v=>{
					v.isActive = false
					if(v.name == item.name){
						v.isActive = true
					}
				})
				if(item.name == "全部"){
					this.apiInfo.minor = ""
				}else{
					this.apiInfo.minor = item.name
				}
				this.getbooksList()
			},
			//获取书单列表
			async getbooksList(){
				const {data} = await uni.$http.get("/book/by-categories",{
					...this.apiInfo
				})
				this.booksList = data.books
				this.booksList.forEach(v=>{
					v.cover ="http://statics.zhuishushenqi.com"+decodeURIComponent(v.cover)
					v.latelyFollower = parseFloat(v.latelyFollower / 10000).toFixed(1)
				})
			},
			toBookdetail(id){
				uni.navigateTo({
					url:"../booksDetail/booksDetail?id="+id
				})
			}
		},
		onReachBottom() {
			this.apiInfo.limit = this.apiInfo.limit + 10;
			this.getbooksList()
		},
		onPullDownRefresh() {
			this.apiInfo.limit = 20;
			this.getbooksList()
		}
	}
</script>

<style lang="scss">
	.header{
		width: 100%;
		position: fixed;
		height: 80px;
		top: 0;
		background-color: #fff;
	}
	.type{
		display: flex;
		text{
			font-size: 12px;
			padding: 10px;
		}
		.color{
			color: rgb(64,158,255);
		}
	}
	.typeSmall{
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		.scllo{
			height: 30px;
			text{
				font-size: 12px;
				padding: 10px;
			}
			.color{
				color: rgb(64,158,255);
			}
		}
	}
	.top{
		margin-top: 90px;
	}
</style>
