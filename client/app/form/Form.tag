<style>
	.my-form-container {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 600px;
		background: rgba(0, 0, 0, 0.6);
		z-index: 10000;
	}
	.my-form {
		width: 300px;
		height: 400px;
		background: #002758;
		margin: 0px auto;
		position: relative;
		top: 50px;
		padding: 10px;
		border-radius: 10px;
	}
	.hero-list {
		list-style-type: none
	}
	.my-form-title {
		text-align: center;
		color: white;
		display: block;
		margin: 0px auto;
		margin-top: 10px;
		font-size: 22px; 
	}
	.my-form-input {
		margin: 0px auto;
		margin-top: 20px;
		border: 3px solid #1f69c5;
    border-radius: 10px;
    display: block;
    width: 200px;
    height: 36px;
    background: rgb(0, 68, 154);
		color: white;
		font-size: 16px;
	}
	.my-form-submit {
		text-align: center;
		margin-top: 20px;
	}
	.my-form-submit input {
		width: 60px;
    border-radius: 10px;
    height: 36px;
    background: #2e9bb1;
    border: 1px solid #80b8ff;
    /* border: none; */
    color: white;
    font-size: 18px;
	}
	.hero-list-container {
		margin-top: 20px;
	}
	.hero-list-title {
		color: white;
    background: #051933;
    text-align: center;
		padding: 10px;
	}
	.hero-list {
		list-style-type: none;
		width: 100%;
		height: 34px;
		padding: 0px;
		margin: 0px;
		line-height: 34px;
		font-size: 16px;
	}
	.hero-list li {
		height: 34px;
	}
	.hero-list span {
		display: inline-block;
		width: 50%;
		float: left;
		text-indent:1em;
	}
	.hero-list b {
		display: inline-block;
    width: 50%;
    float: right;
    margin-left: 0px;
    text-indent: 5em;
	}
</style>
<div class="my-form-container">
	<div class="my-form">
		<form>
			<div if="{submitted}">
				<div class="my-form-submit">
					<input type="button" value="重开" onclick="{onRestart}">
				</div>
			</div>
			<div if="{!submitted}">
				<div class="my-form-title">
					<div>请输入你的名字</div>
				</div>
				<div>
					<input ref="username" class="my-form-input" type="text">
				</div>
				<div class="my-form-submit">
					<input type="button" value="提交" onclick="{onSubmit}">
				</div>
			</div>
			<div class="hero-list-container">
				<div class="hero-list-title">国服前五卡牌</div>
				<ul class="hero-list">
					<li style="background: {index % 2 === 0 ? '#4c78b1' : '#3b5e8c' }" each="{hero, index in list}">
						<span>{hero.name}</span>
						<b>{hero.score}</b>
					</li>
				</ul>
			</div>
		</form>
	</div>
</div>