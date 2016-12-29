<style>
	.footer {
		margin: 0px auto;
		width: 1080px;
		height: 86px;
		position: relative;
		top: -86px;
	}
	.skill-box {
		width: 32px;
		height: 32px;
		border: 1px solid #9e9e9e;
		position: absolute;
	}
	.skill-box1 {
		top: 12px;
		left: 410px;
	}
	.skill-box2 {
		top: 12px;
		left: 448px;
	}
	.cdmask {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		background: black;
		opacity: 0.8;
		z-index: 100;
		overflow: hidden;
	}
	.full {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 50;
	}
	
</style>
<div class="footer">
	<div class="skill-box skill-box1"></div>
	<div class="skill-box skill-box2">
		<div>
			<div class="cdmask" show="{skill2 && skill2.isCD}">
				<div class="progress-circle progress-{spendRate}"></div>
			</div>
				
			</div>
			<img class="full" src="{skill2 && skill2.img}"/>
			<!-- <div class="full" style="background: {skill2 && skill2.img}"></div> -->
		</div>
	</div>
</div>