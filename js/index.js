window.onload = function(){    //window.onload是在所有文件加载完之后执行
	var c = document.getElementById('c1'); //找到canvas元素
	var ctx = c.getContext("2d"); 
	var i=0; 
	
	var yImag = new Image();
	yImag.src = 'person.png';  //预加载青蛙的图片
	yImag.onload = function(){
		//beginPath() 方法开始一条路径，或重置当前的路径。
		//closePath() 方法创建从当前点到开始点的路径(即封闭曲线)。 
		setInterval(function(){
			ctx.clearRect(0,0,c.width,c.height);//清除整个画布
			ctx.beginPath();
			ctx.arc(300,200,200,-90*Math.PI/180,180*Math.PI/180,false);
			ctx.stroke();//stroke()方法会绘制出通过方法定义的路径。默认颜色是黑色。
			
			ctx.beginPath();
			ctx.arc(250,200,150,180*Math.PI/180,360*Math.PI/180,false);
			ctx.stroke();//stroke()方法会绘制出通过方法定义的路径。默认颜色是黑色。
			
			ctx.beginPath();
			ctx.arc(400,200,20,0,360*Math.PI/180,false);
			ctx.stroke();//stroke()方法会绘制出通过方法定义的路径。默认颜色是黑色。
		
			for(var i=0;i<ball.length;i++){ //对每个黑球都是1000/60s执行一次
				ctx.beginPath();
				ctx.moveTo(ball[i].x,ball[i].y);//moveTo方法把路径移动到画布中的指定点
				ctx.arc(ball[i].x,ball[i].y,20,0,360*Math.PI/180,false);
				ctx.fill();//填充小球为黑色
			}
			
			ctx.save();//使青蛙不受定时器影响，http://blog.csdn.net/oney139/article/details/8143281
			ctx.translate(300,200);
			ctx.rotate(iRotate);
			ctx.translate(-40,-40);
			ctx.drawImage(yImag,0,0); //将图片加到指定位置 
			ctx.restore();
			
			for(var i=0;i<bullet.length;i++){ //对每隔个子弹都是1000/60s执行一次
				ctx.save();
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.moveTo(bullet[i].x,bullet[i].y);//moveTo方法把路径移动到画布中的指定点
				ctx.arc(bullet[i].x,bullet[i].y,20,0,360*Math.PI/180,false);
				ctx.fill();//填充小球为黑色
				ctx.restore();
			}
			
			ctx.save();
			ctx.font = '40px impact';
			ctx.textBaseline = 'top';
			ctx.fillStyle = 'red';
			ctx.shadowOffsetX = 10;
			ctx.shadowOffsetY = 10;
			ctx.shadowColor = 'green';
			ctx.shadowBlur = 5;
			var w = ctx.measureText('祖玛小游戏').width;
			var h = 60;
			ctx.fillText('祖玛小游戏', (c.width - w)/2 , 450 );
			ctx.restore();
		
		},1000/60);
		
		setInterval(function(){     //动态改变黑圆x，y
			
			for(var i=0;i<ball.length;i++){
			
				ball[i].num++;
				if(ball[i].num == 270){  //判断小黑圆是否走到大圆与小圆的交界处
					ball[i].r = 150;
					ball[i].startX = 250;
					ball[i].startY = 50;
				}
				
				if(ball[i].num == 270+180){  // 终止条件
					alert('GAME OVER !');
					window.location.reload();//刷新页面
				}
				
				
				ball[i].x = Math.sin(ball[i].num*Math.PI/180)*ball[i].r+ball[i].startX;
				ball[i].y = ball[i].r - Math.cos(ball[i].num*Math.PI/180)*ball[i].r+ball[i].startY;
				
			}
			
			for(var i=0;i<bullet.length;i++){ //每隔子弹的位置随速度的变化
				bullet[i].x = bullet[i].x+bullet[i].speedX;
				bullet[i].y = bullet[i].y+bullet[i].speedY;
			}
			
			for(var i=0;i<bullet.length;i++){ //碰撞检测
				for(var j=0;j<ball.length;j++){
					if(pz(bullet[i].x,bullet[i].y,ball[j].x,ball[j].y)){
						bullet.splice(i,1);//删除一个子弹
						ball.splice(j,1);
						break;
					}
				}
			}
			
		},30); 
		
		var ball = [];  //祖玛中的球
		
		setInterval(function(){
			ball.push({
				x : 300,
				y : 0,
				r : 200, //半径
				num : 0,  //角度从0开始累加
				startX : 300, //固定圆心坐标
				startY : 0 //固定圆心坐标
			})
		},350);         //每隔350s放进去一个黑圆
		
		var iRotate = 0;
		c.onmousemove = function(ev){
			var ev = ev||window.event;
			var x = ev.clientX - c.offsetLeft;
			var y = ev.clientY - c.offsetTop;
			var aa = x - 300;
			var bb = y - 200;
			var cc = Math.sqrt(aa*aa + bb*bb);//勾股定理
			
			if(aa>0 && bb>0){
				iRotate = Math.asin(bb/cc)+90*Math.PI/180;
			}else if(aa>0){ 
				iRotate = Math.asin(aa/cc);
			}
			if(aa<0 && bb>0){
				iRotate = -(Math.asin(bb/cc)+90*Math.PI/180);
			}else if(aa<0){ 
				iRotate = Math.asin(aa/cc);
			}
		};
		
		var bullet = [];   //定义子弹
		c.onmousedown = function(ev){
			var ev = ev||window.event;
			var x = ev.clientX - c.offsetLeft;
			var y = ev.clientY - c.offsetTop;
			var aa = x - 300;
			var bb = y - 200;
			var cc = Math.sqrt(aa*aa + bb*bb);//勾股定理
			
			var speed = 5;  //子弹速度
			var speedX = speed * aa/cc; //子弹在X方向的速度
			var speedY = speed * bb/cc;
			
			bullet.push({   //放入子弹
				x : 300,
				y : 200,
				speedX : speedX,
				speedY : speedY
			});
		}
		 
	};
	
	function pz(x1,y1,x2,y2){ //定义碰撞函数
		var aa = x1-x2;
		var bb = y1-y2;
		var cc = Math.sqrt(aa*aa+bb*bb);
		
		if(cc < 40){
			return true; //如果检测到两个球的半径之和小于40，则说明二球已碰撞
		}else{
			return false;
		}
	}
	
};
