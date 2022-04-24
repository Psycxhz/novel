<template>
	<view>
		<view class="books-item">
			<view class="books-item-l">
				<image class="books-item-image" :src="bookInfo.cover" mode="暂时没有"></image>
			</view>
			<view class="books-item-r">
				<view class="title top">
					{{bookInfo.title}}
				</view>
				<view class="author top">
					{{bookInfo.author}}
				</view>
				<view class="shortIntro top">
					{{bookInfo.shortIntro}}
				</view>
				<view class="major top">
					{{bookInfo.majorCate}},{{bookInfo.minorCate}} | <text class="renqi">{{bookInfo.latelyFollower}}</text> 万人气
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"books",
		props:{
			bookInfo:{
				type:Object,
				default:{}
			},
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.books-item{
		margin-top: 20px;
		display: flex;
		.books-item-l{
			width: 100px;
			height: 100px;
			.books-item-image{
				width: 80%;
				height: 90%;	
			}
		}
		.books-item-r{
			font-size: 12px;
			color: rgb(153,153,153);
			.top{
				margin-top: 0.2rem;
			}
			.title{
				font-size: 18px;
				font-weight: bold;
				color: black;
			}
			.shortIntro{
				width: 250px;
				overflow:hidden;
				white-space: nowrap;
				text-overflow:ellipsis;
			}
			.renqi{
				margin-left: 0.5rem;
				color: rgb(255,130,198);
			}
		}
	}
</style>
