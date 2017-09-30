var Counpons = function(config){
    var self = this;
    var opts = {
        doms : {
            amount : $('#amount'),
            income: $('#income'),
            more: $('#more'),
            result : $('#coupon-selected'),
            resultText : $('#coupon-selected-text'),
            counpon: $('.coupon-radio'),
            counponList: $('.coupon-list'),
            counponItem: $('.coupon'),
            couponType: $('#coupon_type'),
            couponCount: $('#coupon-count'),
            couponCountText: $('#coupon-count-text'),
            notUseAnyCounpon : $('#c-0')
        },
        style : {
            disabled: 'is-disabled',
            expanded: 'is-expanded',
            available: '.available'
        },
        text : {
            noAvailable : '暂无可用的投资券'
        },
        isMobile : false,
        prjData: window.prjData,
        counponData: window.availableCoupons || []
    };

    $.extend(true, opts, config || {});

    //除了"不使用投资券"以外的选项
    var filterDoms = {

        counpon : opts.doms.counpon.filter(opts.style.available)
    };

    //基础方法 返回数组最大值的索引
    var _max = function(array){
        var max = array[0];
        var maxIndex = 0;
        for (var i = 1; i < array.length; i++) {
            if (+array[i] > +max) {
                maxIndex = i;
                max = array[i];
            }
        }
        return maxIndex;
    };

    //基础方法 返回数组最小值的索引
    var _min = function(array){
        var min = array[0];
        var minIndex = 0;
        for (var i = 1; i < array.length; i++) {
            if (+array[i] < +min) {
                minIndex = i;
                min = array[i];
            }
        }
        return minIndex;
    };

    //计算预计收益(元)
    var countIncome = function(value,rate,days) {
        var repayPlan = Util.repayPlanByDays('1');
        return repayPlan(+value, rate, days);
    };

    //查找最小的min_buy_amount 返回最小投资多少可以使用投资券的金额(分)
    var findMinBuyAmount = function(){
        var min_buy_amount = [];
        $.each(opts.counponData, function(index, val) {
            min_buy_amount.push(val.min_buy_amount);
        });
        return min_buy_amount[_min(min_buy_amount)];
    };

    //通过unid查找指定的投资券
    function findCoupon (unid) {
        var coupon = {};
        $.each(opts.counponData, function(index, val) {
            if (val.unid===unid) {
                coupon = val;
            }
        });
        return coupon;
    }

    //过滤当前金额下可以选择的投资券并更新Dom
    var youCanUse = function(value){
        var canUseCounpons = [];
        $.each(opts.counponData,function(index,val) {
            if (value>=val.min_buy_amount) {
                updateDom(1,val.unid);
                canUseCounpons.push(val);
            }else{
                updateDom(0,val.unid);
            }
        });
        function updateDom (flag,unid) {
            if (flag===1) {//开启
                if (opts.isMobile) {
                    $("[data-unid='" + unid +"' ]").prop('disabled', false);
                }else {
                    $("[data-unid='" + unid +"' ]").prop('disabled', false)
                                                                                 .parent('li').removeClass(opts.style.disabled);
                }														 
            }else if(flag===0){//禁用
                if (opts.isMobile) {
                    $("[data-unid='" + unid +"']").prop('disabled', true);
                }else {
                    $("[data-unid='" + unid +"']").prop('disabled', true)
                                                                            .parent('li').addClass(opts.style.disabled);
                }
            }
            //更新可用券的总数
            var length = canUseCounpons.length;
            opts.doms.couponCount.show();
            opts.doms.couponCountText.text(length);
        }
        updateDom();
        return canUseCounpons;
    };

    //计算投资券的收入
    var counponIncome = function(counpon,value){
        //投资券的Type
        //1 满减
        //2 加息
        //3 满返
        var type = +counpon.type;
        if (type===1) {
            return counpon.amount/100;
        }else if(type===2) {
            var rate = Number(counpon.rate);
            var incomeMoney = countIncome(value,rate,opts.prjData.days);
            return Number(incomeMoney);
        }else if(type===3) {
            return counpon.give/100;
        }
    };

    //计算投资券的权重
    var counponPosition = function(counpons) {
        var positions = {};
        $.each(counpons,function(index,val) {
            if (+val.type===3) {
                if (positions[3]) {
                    positions[3].push(val);
                }else {
                    var arr3 = [];
                    arr3.push(val);
                    positions[3] = arr3;
                }					
            }else if (+val.type===1){
                if (positions[1]) {
                    positions[1].push(val);
                }else {
                    var arr1 = [];
                    arr1.push(val);
                    positions[1] = arr1;
                }
            }else if (+val.type===2) {
                if (positions[2]) {
                    positions[2].push(val);
                }else {
                    var arr2 = [];
                    arr2.push(val);
                    positions[2] = arr2;
                }
            }
        });
        
        if (positions[3] && positions[3].length>0) {
            return positions[3];
        }else if(positions[1] && positions[1].length>0) {
            return positions[1];
        }else if(positions[2] && positions[2].length>0) {
            return positions[2];
        }
    };

    //计算时间离当前日期最近的
    var counponTime = function(counpons){
        var now = +new Date();
        var temp = [];
        $.each(counpons, function(index, val) {
            var etime = new Date(val.etime.replace(/-/g, '/')).getTime();
            var diff = etime-now;
            temp.push(diff);
        });
        var min = _min(temp);
        return counpons[min];
    };

    //自动判断使用哪一张券
    var bestChoice = function(counpons,value){
        //选择逻辑
        //收益优先
        //收益相同看类型 满返(3)>满减(1)>加息(2)
        //类型也相同选择到期时间最近的一个
        var best = {};
        var income = [];
        var tempArr = [];
        //计算每一张券的预期收益
        $.each(counpons, function(index, val) {
            income.push(counponIncome(val,value));
        });
        var maxValueIndex = _max(income);
        var maxIncome = income[maxValueIndex];
        $.each(income,function(index,val) {
            if (val===maxIncome) {
                tempArr.push(counpons[index]);
            }
        });
        if (tempArr.length>1) {
            //如果存在收益相同的情况
            //看劵的权重
            var position = counponPosition(tempArr);
            if (position.length>1) {
                //如果存在类型相同的情况
                //选择时间最近的
                best = counponTime(position);
            }else {
                //优先级最高的一张
                best = position[0];
            }
        }else {
            //选择收益最高的
            best = tempArr[0];
        }
        return best;
    };

    //更新Dom 选择指定的投资劵
    var selectCounpon = function(coupon) {
        var unid = coupon.unid;
        $("[data-unid='" + unid +"' ]").click();
    };

    //更新Dom 选择默认的投资劵
    var selectDefaultCoupon = function () {
        opts.doms.notUseAnyCounpon.click();
    };

    //更新Dom 填充投资券类型
    var updateCouponTypeValue = function (value) {
        opts.doms.couponType.val(value);
    };

    //更新Dom 显示选择的结果
    var updateResult = function (name) {
        opts.doms.resultText.text(name);
    };

    //更新Dom 显示使用投资券后的预计收益
    var updateIncome = function (coupon) {
        var value = $.trim(opts.doms.amount.val());
        var income = 0;
        var rate = Number(opts.prjData.rate);
        var prjIncome = countIncome(value,rate,opts.prjData.days);
        if (!coupon.type) {
            //不使用投资券
            opts.doms.income.text(Util.numberFormat(prjIncome,2));
            opts.doms.more.text('');
        }else {
            //使用投资券
            var type = +coupon.type;
            if (type===2) {
                var temp = $.extend(true, {}, coupon);
                temp.rate = Number(temp.rate) + Number(opts.prjData.rate);
                //使用加息劵就把预计加息的收益直接加到项目的预计收益里。
                income = counponIncome(temp,value);
            }else {
                income = counponIncome(coupon,value);
            }
            //投资券的Type
            //1 满减
            //2 加息
            //3 满返
            if (type===2) {
                opts.doms.income.text(Util.numberFormat(income,2));
                opts.doms.more.html('');
            }else if(type===1) {
                opts.doms.income.text(Util.numberFormat(prjIncome,2));
                opts.doms.more.html('再减免本金<strong>'+income+'</strong>元');
            }else if(type===3) {
                opts.doms.income.text(Util.numberFormat(prjIncome,2));
                opts.doms.more.html('再返现<strong>'+income+'</strong>元');
            }
        }
    };

    //监听选择投资券的下拉按钮
    var bindSelect = function() {
        opts.doms.result.on('click', function(e) {
            e.preventDefault();
            if (opts.doms.counponItem.length>0 && !opts.doms.result.hasClass(opts.style.disabled)) {
                opts.doms.result.toggleClass(opts.style.expanded);
                opts.doms.counponList.toggleClass(opts.style.expanded);
            }
            if (opts.doms.result.hasClass(opts.style.disabled)) {
                opts.doms.result.removeClass(opts.style.expanded);
            }
        });
    };

    //监听下拉菜单的点击
    var bindCounponSelect = function() {
        opts.doms.counpon.on('click', function(e) {
            $(e.currentTarget).parents('li.coupon').siblings().removeClass('checked');
            $(e.currentTarget).parents('li.coupon').addClass('checked');
            opts.doms.counponList.removeClass(opts.style.expanded);
        });
    };

    //投资券改变后需要做的事情
    var afterSelect = function(name,coupon) {
        updateResult(name);
        updateIncome(coupon);
    };

    //监听投资券选择
    var bindCounpon = function(){
        opts.doms.counpon.on('click', function(e) {
            var $this = $(this);
            var type = $this.data('type');
            updateCouponTypeValue(type);
            if (!opts.isMobile) {
                var name = $this.data('name');
                var unid = $this.data('unid');
                var coupon = findCoupon(unid);
                afterSelect(name,coupon);
            }
        });
        if (!opts.isMobile) {
            bindSelect();
            bindCounponSelect(); 
        }
    };

    //计算还差多少元可以使用投资券
    Counpons.prototype.payMore = function(value){
        //首先重置投资劵的选择，默认选中到“不使用投资劵” 浏览器后退功能
        selectDefaultCoupon();
        var money = Number(value);
        if (opts.counponData.length<1) {
            opts.doms.result.addClass(opts.style.disabled);
            opts.doms.resultText.text(opts.text.noAvailable);
        } else {
            var minBuyAmount = findMinBuyAmount()/100;
            if ( money < minBuyAmount ) {
                var diff = minBuyAmount-money;
                opts.doms.result.addClass(opts.style.disabled);
                opts.doms.resultText.text('再投'+ diff +'元即可使用投资券');
                opts.doms.couponCount.hide();
            }else {
                opts.doms.resultText.text('');
                opts.doms.result.removeClass(opts.style.disabled);
                self.autoSelect(value);
            }
        }
    };

    //自动选择收益最高的投资券
    Counpons.prototype.autoSelect = function(value){
        var money = value*100;
        var icanuse = youCanUse(money);
        var best = bestChoice(icanuse,value);
        selectCounpon(best);
    };

    bindCounpon();
    
};

module.exports = Counpons;