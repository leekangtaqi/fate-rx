<style scoped>
	.scene{
		background: url('../../assets/images/scene2.png') 100% 100%;
		
		background-size: 100% 100%;
		width: 1080px;
		height: 600px;
		margin: 0px auto;
		padding: 0px;
	}
	.panel {
		width: 70px;
		padding: 20px;
		background: rgba(4, 30, 58, 0.7);
		list-style-type: none
	}
	.panel li {
		height: 32px;

	}
	span {
		color: white
	}
	b {
		margin-left: 30px;
		color: white
	}
	img {
		width: 16px;
		height: 20px;
	}
</style>
<div class="scene">
	<ul class="panel">
		<li><span>剩余时间</span></li>
		<li><span style="color: yellow">{wholeTime || 0}</span><span style="margin-left: 20px">秒</span></li>
		<li><img src="{redPath}"/><b>{redsNum || 0}</b></li>
		<li><img src="{yellowPath}"/><b>{yellowsNum || 0}</b></li>
		<li><img src="{bluePath}"/><b>{bluesNum || 0}</b></li>
		<li><span>分</span><b>{yellowsNum || 0}</b></li>
	</ul>
	<div ref="hero"></div>
</div>