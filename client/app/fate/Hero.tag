<style>
	.hero-container {
		width: 100px;
		height: 150px;
		position: absolute;
		top: 160px;
		left: 580px;
	}
	.hero-status {
		position: absolute;
	}
	.hero-role {
		position: absolute;
	}
	.hero-skill {
		transition: 0.3s;
		width: 16px;
		height: 25px;
		background: red;
		border-radius: 2px;
		box-shadow: 0px 0px 4px rgba(255, 255, 255, 1);
		border: 1px solid rgba(255, 255, 255, 0.8);
		top: 46px;
		left: 42px;
		position: absolute;
	}
</style>
<div class="hero-container">
	<div>
	</div>
	<div>
	</div>
	<img class="hero-skill" if="{skill && skill.img}" src="{skill && skill.img}">
</div>