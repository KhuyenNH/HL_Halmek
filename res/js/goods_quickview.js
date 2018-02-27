var QV = {
  "goods" : "",
  "flg_window_load" : false,
  "api_url_goods_info" : EC_WWW_ROOT + "/shop/search/goodslistforajax.aspx",
  "api_url_goods_stocks" : EC_WWW_ROOT + "/shop/search/stockslistforajax.aspx",
  "modal_open_timer" : null,
  "replace_large_img_path" : function(path){
    var t = path.replace(/goods\/(.)\//g,"goods/$1/a");
    return t;
  },
  "Number" : function(t){
    var n = Number(t.replace(',','').replace(' ','').replace('�~',''))
    return n;
  },
  "check_img_path" : function(path){
    var r = true;
    if( path == "" || path.match("/sys/") ){
      r = false;
    }
    return r;
  },
  "escape_id" : function(t){
    var r = t.replace(/\/|\./g,"");
    return r;
  },
  "data_blank" : function(d){
    var r = false;
    if(typeof d != "undefined" && d != null && d !=""){
      r = true;
    }
    return r;
  },
  "body_scroll_st" : 0,
  "body_scroll_fixed" : {
    "on" : function(){
      //�w�i�v�f�̃X�N���[���Œ�
      QV.body_scroll_st = jQuery(window).scrollTop();
      jQuery("body").css({
        'position' : 'fixed',
        'width' : '100%',
        'height' : '100%',
        'overflow' : 'scroll',
        'top' : -QV.body_scroll_st
      })
    },
    "off" : function(){
      jQuery("body").css({
        'position' : '',
        'width' : '',
        'height' : '',
        'overflow' : '',
        'top' : ''
      });
      jQuery('html,body').animate({
        scrollTop : QV.body_scroll_st
      },0);
    }
  },
  "sp_size_table_transform" : function(table){
    
    var table_object = [];

    jQuery(table).find("thead tr > *").each(function(i){
      if(jQuery(this).text() != ""){
        table_object.push({"valiation_name":jQuery(this).text(),"params":[]});
      };
    });
    jQuery(table_object).each(function(i){
      
      var valiation = this;
      var index = i;
      jQuery(table).find("tbody tr").each(function(n){
        var tr = jQuery(this);
        var params = [];
        var name = tr.find('th').text();
        var value = tr.find('td:eq('+index+')').text();
        
        table_object[index].params.push({
          "name" : name,
          "value" : value
        });
      });
    });
    
    var table_sp = "";
    table_sp += '<table class="misc-table table-bordered mb-g3">';
    
    jQuery(table_object).each(function(i){
      table_sp += 
        '<tr>'+
          '<th>'+table_object[i].valiation_name+'</th>'+
          '<th>&nbsp;</th>'+
        '</tr>';
        jQuery(table_object[i].params).each(function(n){
      table_sp +=
          '<tr>'+
            '<td>'+table_object[i].params[n].name+'</td>'+
            '<td>'+table_object[i].params[n].value+'</td>'+
          '</tr>';
        });
    });

    table_sp += '</table>';

    return table_sp;
  }
}

jQuery(window).load(function(){
  QV.flg_window_load = true;
});

jQuery(function(){
  jQuery('body').append(
    '<div id="stocksModal" class="modal modal-size-S hide fade quickview_stocks_modal" tabindex="-1" role="dialog" aria-labelledby="stocksModalLabel" aria-hidden="true"></div>'+
    '<div id="quickviewModal" class="modal modal-size-L hide fade" tabindex="-1" role="dialog" aria-labelledby="quickviewModalLabel" aria-hidden="true">'+
    '  <div class="modal-header">'+
    '    <button type="button" class="btn btn-baige close" data-dismiss="modal" aria-hidden="true"><i class="icon ico-ex btn16-cross-0">�~</i><span class="text tx-btn s16-close">����</span></button>'+
    '  </div>'+
    '  <div class="modal-body">'+
    '    <div class="modal-body-iwrap" id="quickview_modal_html">'+
    '    </div>'+
    '  </div>'+
    '</div>'+
    '<div id="modal1" class="modal size-M hide fade modal-size-S error-modal in" aria-hidden="true" aria-labelledby="miscModalLabel2" role="dialog" tabindex="-1">'+
    '  <div class="modal-header">'+
    '    <button class="btn btn-baige close" aria-hidden="true" data-dismiss="modal" type="button">'+
    '      <i class="icon ico-ex btn16-cross-0">�~</i>'+
    '      <span class="text tx-btn s16-close">����</span>'+
    '    </button>'+
    '    <h3 id="miscModalLabel1">�F/�T�C�Y�����I�΂�Ă��܂���B</h3>'+
    '  </div>'+
    '  <div class="modal-body">'+
    '    <div class="modal-body-iwrap">�F/�T�C�Y�������I�т�����������A�������������ɓ����(���֐i��)�{�^���������Ă��������B</div>'+
    '  </div>'+
    '</div>'+
    '<div id="goodsnullmodal" class="modal size-M hide fade modal-size-S error-modal in" aria-hidden="true" aria-labelledby="miscModalLabel2" role="dialog" tabindex="-1">'+
    '  <div class="modal-header">'+
    '    <button class="btn btn-baige close" aria-hidden="true" data-dismiss="modal" type="button">'+
    '      <i class="icon ico-ex btn16-cross-0">�~</i>'+
    '      <span class="text tx-btn s16-close">����</span>'+
    '    </button>'+
    '    <h3 id="miscModalLabel1">�G���[���������܂����B</h3>'+
    '  </div>'+
    '  <div class="modal-body">'+
    '    <div class="modal-body-iwrap">���i��������܂���ł����B</div>'+
    '  </div>'+
    '</div>'+
    '<div id="jscart_replace_"></div>'
  );
  
  QV.modal_stocks = jQuery("#stocksModal");
  QV.modal_quickview = jQuery("#quickviewModal");
  
  //script�@�ǂݍ��ݒǉ�
  var load_scripts_path = [
    "/js/goods_detail_ajax_cart.js",
    "/res/js/Recommend.js",
    "/js/View.itemDetail_recommendgoods.js",
    "/res/js/lib/jquery.flexslider.min.js",
    "/js/goods_detail.js"
  ]
  jQuery(load_scripts_path).each(function(i){
    var ele = document.createElement("script");
    ele.type = "text/javascript";
    ele.src = EC_WWW_ROOT+load_scripts_path[i];
    document.body.appendChild(ele);
  });
  
  //�݌Ƀ��[�_���{�^��
  jQuery('.btn_stock_show').each(function(){
    jQuery(this).click(function(){
      QV.goods = jQuery(this).data('goods');
      clearTimeout(QV.modal_open_timer);
      
      //�y�[�W�����[�h����Ă��烂�[�_���I�[�v��
      QV.modal_open_timer = setInterval(function(){
        if(QV.flg_window_load){
          QV.modal_stocks.modal('show');
          clearTimeout(QV.modal_open_timer);
        }
      },100);
    });
  });
  
  //SP�݌Ɉꗗ���[�_���{�^��
  jQuery('.btn_quickview_stock').each(function(){
    jQuery(this).click(function(e){
      QV.goods = jQuery(this).data('goods');
      clearTimeout(QV.modal_open_timer);
      
      //�y�[�W�����[�h����Ă��烂�[�_���I�[�v��
      QV.modal_open_timer = setInterval(function(){
        if(QV.flg_window_load){
          QV.modal_stocks.modal('show');
          clearTimeout(QV.modal_open_timer);
        }
      },100);
    });
  });

  //�N�C�b�N�r���[���[�_���{�^��
  jQuery('.btn_quickview_img').each(function(){
    jQuery(this).click(function(e){
      QV.goods = jQuery(this).data('goods');
      clearTimeout(QV.modal_open_timer);
      
      //�y�[�W�����[�h����Ă��烂�[�_���I�[�v��
      QV.modal_open_timer = setInterval(function(){
        if(QV.flg_window_load){
          QV.modal_quickview.modal('show');
          clearTimeout(QV.modal_open_timer);
        }
      },100);
    });
  });

  
  QV.modal_quickview.on('hidden.bs.modal', function (event) {
    //���[�_�������
    jQuery('#quickview_modal_html').html('');
    QV.modal_quickview.removeClass('loaded');
  });
  QV.modal_quickview.on('show.bs.modal', function (event) {
    QV.body_scroll_fixed.on();
  });
  QV.modal_quickview.on('hide.bs.modal', function (event) {
    QV.body_scroll_fixed.off();
  });
  QV.modal_quickview.on('shown.bs.modal', function (event) {
    
    var modal_height = window.innerHeight-90;
    QV.modal_quickview.find(".modal-body").css({
      "height" : modal_height,
      "max-height" : modal_height
    });

    //���[�_�����J��
    
    jQuery.ajax({
      type: "GET",
      url: QV.api_url_goods_info,
      cache : false,
      dataType: "json",
      data: "goods="+QV.goods,
      success: function(json){

        QV.modal_quickview.addClass('loaded');

        var quickview_modal_html = '<div class="mainframe_">'+
          
          '<input type="hidden" value="' + QV.goods + '" id="hidden_variation_group">'+
          '<input type="hidden" value="0" id="variation_design_type">'+
          '<input type="hidden" value="' + json.item.item_cd + '" id="hidden_goods">'+
          '<section class="mb-g1">'+
          '  <div id="pageTitles" class="cfx">'+
          '    <div class="">'+
          '      <header>'+
          '        <p class="badges">';
          if(json.TargetItem.icon == "NEW"){
            quickview_modal_html += '<mark class="icon ico-ex badge-L-new">NEW</mark>';
          }
          if(json.TargetItem.icon1 != ""){
            quickview_modal_html += '<img src="'+json.TargetItem.icon1+'">';
          }
          if(json.TargetItem.icon2 != ""){
            quickview_modal_html += '<img src="'+json.TargetItem.icon2+'">';
          }
          if(json.TargetItem.icon3 != ""){
            quickview_modal_html += '<img src="'+json.TargetItem.icon3+'">';
          }
          quickview_modal_html += 
          '        </p>'+
          '        <h1>'+json.item.name+'</h1>'+
          '      </header>'+
          '    </div>'+
          '  </div>'+
          '  <div class="clm2-detail">'+
          '    <div class="cfx">'+
          '      <div class="tab-content left">'+
          '        <div class="tab-pane active" id="imagesTab">'+
          '          <div class="tab-inner">'+
          '            <div class="slider-container pb-g1">'+
          '              <div id="imgSlider" class="ifs ifs-size-L ifs-w546">'+
          '                <ul class="slides large-images">';
          
          var slider_img_L_html = "";
          
          jQuery(json.options.color).each(function(){
            if(QV.check_img_path(this.thumb)){
              var short_label = "";
              if(this.name != ""){
                short_label = "�F�F"+this.name;
              }
              slider_img_L_html += '<li id="L'+QV.escape_id(this.thumb)+'"><img src="'+QV.replace_large_img_path(this.thumb)+'" alt="'+this.thumb+'" name="" title="'+this.thumb+'"><span class="label">'+short_label+'</span></li>';
            }
          });

          if(QV.check_img_path(json.item.image_srcl)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_srcl)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_srcc)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_srcc)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src1)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src1)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src2)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src2)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src3)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src3)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src4)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src4)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src5)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src5)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src6)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src6)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src7)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src7)+'" alt="" name="" title=""></li>';
          }
          if(QV.check_img_path(json.item.image_src8)){
            slider_img_L_html += '<li><img src="'+QV.replace_large_img_path(json.item.image_src8)+'" alt="" name="" title=""></li>';
          }
          
          quickview_modal_html += slider_img_L_html;
          
          quickview_modal_html +=
          '                </ul>'+
          '              </div>'+
          '            </div>'+
          '            <div class="ifs-sp-tooltip">'+
          '              <div class="inner"></div>'+
          '            </div>'+
          '            <div id="carouselTmpl" class="carousel-container pt-g3">'+
          '              <div id="carousel1" class="ifs ifs-size-S ifs-w546" data-option-label="color">'+
          '                <ul class="slides thumbs cfx">'+
          '                  <div id="carousel1" class="ifs ifs-size-S ifs-w546" data-option-label="color">'+
          '                    <ul class="slides thumbs cfx">';

          var slider_img_S_html = "";

          jQuery(json.options.color).each(function(){
            if(QV.check_img_path(this.thumb)){
              var short_label = "";
              if(this.name != ""){
                short_label = this.name.split('_')[1];
              }
              var max_count = 5;
              if(short_label.length > max_count){
                short_label = short_label.substring(0, max_count) + "&#8230;";
              }
              slider_img_S_html += '<li data-option-id="'+this.name+'" data-original-title="'+this.name+'" id="thumb'+QV.escape_id(this.thumb)+'" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img  alt="'+this.name+'" src="'+this.thumb+'" draggable="false" class="variation-img"><span class="frame"></span><span class="label">'+short_label+'</span></p></li>';
            }
          });

          if(QV.check_img_path(json.item.image_srcl)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_srcl+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_srcc)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_srcc+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src1)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src1+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src2)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src2+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src3)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src3+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src4)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src4+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src5)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src5+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src6)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src6+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src7)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src7+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }
          if(QV.check_img_path(json.item.image_src8)){
            slider_img_S_html += '<li data-option-id="" data-original-title="" class="variation-img-list"><p rel="fixed-tooltip" class="thumb78"><img src="'+json.item.image_src8+'" class="variation-img" alt="" name="" title=""><span class="frame"></span></p></li>';
          }

          quickview_modal_html += slider_img_S_html;
          
          quickview_modal_html +=
          '                    </ul>'+
          '                  </div>'+
          '                </ul>'+
          '              </div>'+
          '            </div>'+
          '          </div>'+
          '        </div>'+
          '      </div>'+
          '      <div class="right" id="buyBox">'+
          '        <div class="bb-header">'+
          '          <h3>���i(�ō�)�F</h3>';
          
/*
�E�u�Z�[�����v�̂݁A�l���Z�b�g����Ă���ꍇ�́A�u�Z�[�����v��\������B
�E�u%OFF�v�̂݁A�l���Z�b�g����Ă���ꍇ�́A�u%OFF�v��\������B
�E�̔����i �� �Z�[�����i�̏ꍇ��%OFF�\���B
�E�̔����i �� �Z�[�����i�ŃZ�[�����������Ă���ꍇ�̓Z�[�����\���B

���̔����i�ƃZ�[�����i���C�R�[���̏ꍇ�́A%OFF�A�Z�[���ǂ�����\������܂���B
�@�u�Z�[�����v�Ɓu%OFF�v�̗������\������邱�Ƃ�����܂���B
*/
          
          if(json.item.price_note != ""||json.item.discount_rate != ""){
            //�Z�[�����i�������́A�Z�[�������͂���Ă���
            
            var num_format_default_price = QV.Number(json.TargetItem.format_default_price);
            var num_regular_price = QV.Number(json.item.regular_price);

            //�ŏ������i
            if(json.item.price_note == "" && json.item.discount_rate != ""){
              quickview_modal_html += 
                '<p class="price_strike"><strike>'+json.TargetItem.format_default_price+'(�ō�)</strike></p>';
            }
            
            //�Z�[����
            if(json.item.price_note != ""){
              //�Z�[�����������Ă���
              quickview_modal_html += 
                '<p class="goods_icon_sale_wrap"><span class="goods_icon_sale">'+json.item.price_note+'</span></p>';
            }
            
            //�ŏ������i
            if(json.item.price_note == "" && json.item.discount_rate != ""){
              quickview_modal_html += 
                '<p class="price_discount_rate">'+json.item.discount_rate+'</p>';
            }

            if(json.item.regular_price != ""){
              quickview_modal_html += 
                '<p><span class="price price_campaign">'+json.item.regular_price+'<span class="label_zeikomi">(�ō�)</span></span></p>';
            }
          } else {
            quickview_modal_html += 
              '<p class="price">'+json.item.regular_price+'<span class="label_zeikomi">(�ō�)</span></p>';
          }
          
          if(json.TargetItem.postage != ""){
            quickview_modal_html +=
            '          <p class="postage">'+
            '            �z����:<span>'+json.TargetItem.postage+'</span>'+
            '          </p>';
          }
          
            quickview_modal_html +=
              '    </div>'+
              '    <div class="quickview_tab_contents_wrapper forSp">'+
              '      <ul class="tabs showSp">'+
              '        <li class="showSp"><a href="javascript:void(0)">�w��</a></li>';


            if(QV.data_blank(json.TargetItem.size_table)){
              quickview_modal_html +=
              '        <li><a href="javascript:void(0)">�T�C�Y�ꗗ</a></li>';
            }
              
            quickview_modal_html +=
              '        <li><a href="javascript:void(0)" class="js-tab_stocks">�݌Ɉꗗ</a></li>'+
              '      </ul>'+
              '      <div class="tab_contents">'+
              '        <div class="tab_content">'+
                '        <div class="bb-body">'+
                '          <form name="frm" method="post" action="'+EC_WWW_ROOT+'/shop/cart/cart.aspx" id="addToCartForm">'+
                '            <input type="hidden" name="qty" id="order_qty" value="1">'+
                '            <input type="hidden" id="itemCodeHidden" value="' + json.item.item_cd + '" name="goods">'+
                '            <div class="relative" id="optSelects">';
                
                //�F�������ꍇ�̓v���_�E����\�����Ȃ�
                if(!json.options.is_not_color_flg){
                quickview_modal_html +=
                '              <div class="mb-g2 g-selectarea" id="colorSelectArea">'+
                '                <h3 class="rhead18">'+
                '                  <span class="opt-name">�F</span>'+
                '                  <span class="rh-bg-r"></span>'+
                '                </h3>'+
                '                <select name="_colorSelect">'+
                '                  <option value="">���I�����Ă�������</option>';
                
                var color_select_option_html = "";
                jQuery(json.options.color).each(function(){
                  color_select_option_html += '<option value="'+this.uid+'">'+this.name+'</option>';
                });
                quickview_modal_html += color_select_option_html;
                
                quickview_modal_html +=
                '                </select>'+
                '              </div>';
                }
                
                //�T�C�Y�������ꍇ�̓v���_�E����\�����Ȃ�
                if(!json.options.is_not_size_flg){
                quickview_modal_html +=
                '              <div class="mb-g2 g-selectarea" id="sizeSelectArea">'+
                '                <h3 class="rhead18">'+
                '                  <span class="opt-name">�T�C�Y</span>'+
                '                  <span class="rh-bg-r"></span>'+
                '                </h3>'+
                '                <select name="_sizeSelect">'+
                '                  <option value="">���I�����Ă�������</option>';

                var size_select_option_html = "";
                jQuery(json.options.size).each(function(){
                  size_select_option_html += '<option value="'+this.uid+'">'+this.name+'</option>';
                });
                quickview_modal_html += size_select_option_html;
                
                quickview_modal_html +=
                '                </select>'+
                '              </div>';
                }
                
                
                
                quickview_modal_html +=
                '            </div>'+
                '            <div class="cfx mb-g3">'+
                '              <div id="qtySelectArea" class="left g-selectarea">'+
                '                <h3 class="rhead18">����'+
                '                  <span class="rh-bg-r"></span>'+
                '                </h3>'+
                '                <select name="_qtySelect">'+
                '                  <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>'+
                '                </select>'+
                '                <option value=""></option>'+
                '              </div>'+
                '              <div class="left relative">'+
                '                <p class="stock-badges">'+
                '                  <span class="sales_view">'+
                '                    <mark class="icon ico-ex badge-stock2" id="goods-badge-stock2">�݌ɂ���</mark>'+
                '                    <mark class="icon ico-ex badge-stock1" id="goods-badge-stock1">�c��킸��</mark>'+
                '                    <mark class="icon ico-ex badge-stock0" id="goods-badge-stock0">�݌ɂȂ�</mark>'+
                '                  </span>'+
                '                </p>'+
                '              </div>'+
                '            </div>'+
                    '        <div id="deliveryDate_sp" class="delivery_date showSp">'+
                    '          <dl>'+
                    '            <dt>���͂����̖ڈ�</dt>'+
                    '            <dd><span data-replacement="1" id="delivery_comment_sp">'+json.item.delivery_date+'��</span></dd>'+
                    '          </dl>'+
                    '          <p>���n��E���i�ɂ���ẮA�����������������������ꍇ������܂��B</p>'+
                    '        </div>'+
                '            <span class="sales_view">'+
                '              <div id="addToCartBtns">'+
                '                <p class="in-stock">'+
                '                  <a class="btn btn-orange btn-large inner-icon-m2 btn_cart_l_" value="1" name="' + json.item.item_cd + '" href="javascript:void(0)" id="ajax-cart-btn">'+
                '                    <i class="icon ico-ex btn18-arrowR-f"></i>'+
                '                    <span class="text tx-btn s18-tocart">�������������ɓ����'+
                '                      <span class="subtext">�i���֐i�ށj</span>'+
                '                    </span>'+
                '                  </a>'+
                '                </p>'+
                '                <p class="no-stock">'+
                '                  <button disabled="disabled" type="button" id="no-stock-btn">������͍D�]�ɂ��������܂����B���̐F�A�T�C�Y���̍݌ɂ͂������܂��B</button>'+
                '                </p>'+
                '              </div>'+
                '            </span>'+
                '            <span class="no-stock-all_view">'+
                '              <div id="addToCartBtns">'+
                '                <p class="no-stock-all">'+
                '                  <button disabled="disabled" type="button" id="no-stock-btn">������͍D�]�ɂ��S�Ċ������܂����B</button>'+
                '                </p>'+
                '              </div>'+
                '            </span>'+
                '            <span class="dummy_view">'+
                '              <div id="addToCartBtns">'+
                '                <p class="in-stock">'+
                '                  <a class="btn btn-orange btn-large inner-icon-m2" name="' + json.item.item_cd + '" id="dummybtn" href="javascript:void(0)">'+
                '                    <i class="icon ico-ex btn18-arrowR-f"></i>'+
                '                    <span class="text tx-btn s18-tocart">�������������ɓ����'+
                '                      <span class="subtext">�i���֐i�ށj</span>'+
                '                    </span>'+
                '                  </a>'+
                '                  <a class="btn btn-orange btn-large inner-icon-m2" name="' + json.item.item_cd + '" id="goodsnullbtn" href="javascript:void(0)">'+
                '                    <i class="icon ico-ex btn18-arrowR-f"></i>'+
                '                    <span class="text tx-btn s18-tocart">�������������ɓ����'+
                '                      <span class="subtext">�i���֐i�ށj</span>'+
                '                    </span>'+
                '                  </a>'+
                '                </p>'+
                '              </div>'+
                '            </span>'+
                '          </form>'+
                '        </div>'+
                '        <div id="deliveryDate" class="delivery_date showPc">'+
                '          <dl>'+
                '            <dt>���͂����̖ڈ�</dt>'+
                '            <dd><span data-replacement="1" id="delivery_comment">'+json.item.delivery_date+'��</span></dd>'+
                '          </dl>'+
                '          <p>���n��E���i�ɂ���ẮA�����������������������ꍇ������܂��B</p>'+
                '        </div>'+
              '        </div>';
              if(QV.data_blank(json.TargetItem.size_table)){
                quickview_modal_html +=
                '        <div class="tab_content showSp">'+
                '          <div class="quickview_modal_sizelist forSp"></div>';
                if(QV.data_blank(json.TargetItem.size_table_comment)){
                  quickview_modal_html +=
                  '          <div class="quickview_sizelist_note_">'+json.TargetItem.size_table_comment+'</div>';
                }
                quickview_modal_html +=
                '        </div>';
              }

              quickview_modal_html +=
              '        <div class="tab_content showSp">'+
              '          <div class="quickview_modal_stockslist"></div>'+
              '        </div>'+
            '        </div>'+
          '        </div>'+
          '        <p class="permalink showPc">'+
          '          <a class="goods_name_" href="'+json.item.permalink+'" title="'+json.item.name+'">'+
          '            <i class="icon ico-14 arrowR"></i>���i�������Əڂ�������'+
          '          </a>'+
          '        </p>'+
          '      </div>'+
          '    </div>'+
      '        <p class="permalink_bottom showSp">'+
      '          <a href="'+json.item.permalink+'" title="'+json.item.name+'">'+
      '            ���i�������Əڂ�������'+
      '          </a>'+
      '        </p>'+
          '    <div class="quickview_tab_contents_wrapper forPc showPc">'+
          '      <ul class="tabs">';
          
          if(QV.data_blank(json.TargetItem.size_table)){
            quickview_modal_html +=
            '      <li><a href="javascript:void(0)">�T�C�Y�ꗗ</a></li>';
          }
          
          quickview_modal_html +=
          '        <li><a href="javascript:void(0)" class="js-tab_stocks">�݌Ɉꗗ</a></li>'+
          '      </ul>'+
          '      <div class="tab_contents">';
          if(QV.data_blank(json.TargetItem.size_table)){
            quickview_modal_html +=
            '        <div class="tab_content">'+
            '          <div class="quickview_modal_sizelist forPc"></div>';
            if(QV.data_blank(json.TargetItem.size_table_comment)){
              quickview_modal_html +=
              '          <div class="quickview_sizelist_note_">'+json.TargetItem.size_table_comment+'</div>';
            }
            quickview_modal_html +=
            '        </div>';
          }

          quickview_modal_html +=
          '        <div class="tab_content current">'+
          '          <div class="quickview_modal_stockslist"></div>'+
          '        </div>'+
          '      </div>'+
          '    </div>'+
          '  </div>'+
          '</section>'+
          '<link rel="stylesheet" type="text/css" href="'+EC_WWW_ROOT+'/css/lightbox.css" media="all" />'+
        '</div>';
        
        jQuery('#quickview_modal_html').append(quickview_modal_html);
        
        
        jQuery('#goods-badge-stock2').css("display", "none");
        jQuery('#goods-badge-stock1').css("display", "none");
        jQuery('#goods-badge-stock0').css("display", "none");

        //�����\����Ԃ�

        //�S�݌ɂ���������p�t���O
        var flg_no_stock_all = true;
        jQuery(json.stock).each(function(){
          if(this.stock_flg != "0"){
            flg_no_stock_all = false;
          }
        });

        //�T�C�Y�A�J���[������ꍇ
        no_colorsize = "";
        if(json.options.is_not_color_flg != "" && json.options.is_not_size_flg != ""){
          //�T�C�Y�E�J���[�̑I��������
          jQuery('.sales_view').css("display", "block");
          jQuery('#ajax-cart-btn').css("display", "block");
          jQuery('#no-stock-btn').css("display", "none");
          jQuery('#deliveryDate, #deliveryDate_sp').css("display", "block");
          jQuery('.no-stock').css("display", "none");
          no_colorsize  = jQuery('.btn_cart_l_').attr('name');
        } else {
          //�T�C�Y�E�J���[�̑I��������
          jQuery('.dummy_view').css("display", "block");
          jQuery('#dummybtn').css("display", "block");
          jQuery('#goodsnullbtn').css("display", "none");
          jQuery('#goods-badge-stock2').css("display", "none");
          jQuery('#goods-badge-stock1').css("display", "none");
          jQuery('#goods-badge-stock0').css("display", "none");
        }
        
        if(flg_no_stock_all){
          qtyselect_disable();
          jQuery('#deliveryDate, #deliveryDate_sp').css("display", "none");
          jQuery('.no-stock-all_view').show();
          jQuery('.dummy_view,.sales_view').hide();
          jQuery('.no-stock-all').show();
          jQuery('.no-stock-all > button').show();
        	//PC
        	jQuery('#optSelects select option:selected').text('�|');
        	jQuery('#optSelects select').addClass('no-init');
        	jQuery('#optSelects select').selectbox("attach").selectbox("disable");
        	//�X�}�z
        	jQuery('#optSelects select').attr("disabled", "disabled");
        	jQuery('#optSelects select').css("border","1px dotted rgb(204, 194, 183)");
        	jQuery('#optSelects select').css("color","rgb(177, 173, 171)");
        }

        goods_detail_ajax_cart_ready();
        
        //�^�u
        jQuery("#quickview_modal_html .quickview_tab_contents_wrapper").each(function(i){
          var this_wrapper = jQuery(this);
          jQuery(this).find(".tabs li").each(function(i){
            jQuery(this).click(function(){
              this_wrapper.find(".tabs li a").removeClass('current');
              this_wrapper.find(".tabs li:eq("+i+") a").addClass('current');
              this_wrapper.find(".tab_contents .tab_content").hide();
              this_wrapper.find(".tab_contents .tab_content:eq("+i+")").show();
            });
          });
        });
        
        //�݌Ɉꗗ�^�u�������̓���
        jQuery(".quickview_tab_contents_wrapper .js-tab_stocks").each(function(){
          jQuery(this).click(function(){
            
            if(jQuery('.quickview_modal_stockslist:eq(0)').html() == ""){
              //�݌Ɉꗗ�Z�b�g
              jQuery.ajax({
                type: "GET",
                url: QV.api_url_goods_stocks,
                cache : false,
                dataType: "json",
                data: "goods="+QV.goods,
                success: function(json){
                  var stocks_list_html = jQuery(json.modal).find('.modal-body-iwrap').html();
                  jQuery('.quickview_modal_stockslist').html(stocks_list_html)
                  jQuery('.quickview_modal_stockslist').addClass("loaded")
                }
              });
            }
          });
        });
        
        //PC�̏ꍇ�̓T�C�Y�ꗗ�^�u���A�N�e�B�u��
        if(viewflag == "defult"){
          jQuery('.quickview_tab_contents_wrapper.forPc .tabs li:eq(0) a').click();
        }
        if(viewflag != "defult"){
          jQuery('.quickview_tab_contents_wrapper.forSp .tabs li:eq(0) a').click();
        }
        
        
        var starteq = jQuery('#imgSlider .slides li').index(jQuery('#L'+QV.escape_id(json.item.thumb)));
        
        //�T�C�Y�ꗗ�Z�b�g
        jQuery('.quickview_modal_sizelist.forPc').html(json.TargetItem.size_table);
        
        jQuery('.quickview_modal_sizelist.forSp').html(QV.sp_size_table_transform(json.TargetItem.size_table));
        
        //goods_detail.js��ready�֐������s
        goods_detail_ready();

        goods_detail_load();

        //�v���_�E�����`
        jQuery("#buyBox .bb-body select").selectbox();
        
        //�摜�ǂݍ��݃`�F�b�N
        var img_length = jQuery("#imagesTab img").length;
        var load_count = 0;
        var img_loaded_check = function(){
          load_count++;
          if( load_count >= img_length ){
            //console.log("�S�ă��[�h���ꂽ");
            slider_ini();
          }
        };
        jQuery("#imagesTab img").each(function(){
          jQuery(this).error(function(){
            img_loaded_check();
            jQuery(this).closest('li').remove();
          });
          jQuery(this).load(function(){
            img_loaded_check();
          });
        });
        
        
        //�摜�ؑ� ���C��
        var slider_ini = function(){
          slider = jQuery('#imgSlider').flexslider({
            namespace: Conf.sliderPref,
            animation: "slide",
            controlNav: false,
            slideshow: false,
            startAt: starteq,
            start: function(){
              jQuery('#thumb'+QV.escape_id(json.item.thumb)).addClass('thumb-selected');

              //SP�X���C�_�[��������
              var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
              jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
            },
            before: function(slider){
              var num = slider.currentSlide,
              $li = jQuery('#imgSlider li'),
              $thumli=jQuery('#imagesTab .slides.thumbs li');
              $li.removeClass('ifs-active-slide')
              $li.eq(num).addClass('ifs-active-slide')
              $thumli.removeClass('thumb-selected')
              $thumli.eq(num).addClass('thumb-selected')
            },
            after: function(slider){
              var num = slider.currentSlide;
              if (num==slider.count) {
                var num = 0
              }
              var $li = jQuery('#imgSlider li'),
              $thumli=jQuery('#imagesTab .slides.thumbs li')
              $li.removeClass('ifs-active-slide')
              $li.eq(num).addClass('ifs-active-slide')
              $thumli.removeClass('thumb-selected')
              $thumli.eq(num).addClass('thumb-selected')
              $paentsUl=jQuery('#imagesTab .slides.thumbs li.thumb-selected').parents('ul')
              $siblingsli=$paentsUl.find('li').length
              
              var slide_thumb_count = 5;
              if(viewflag != "defult"){
                slide_thumb_count = 2;
              }
              
              var tar = Math.floor($paentsUl.find('li.thumb-selected').index()/slide_thumb_count);
              $paentsUl.parents('.ifs').flexslider(tar);

            }
          });
          
        }
              
        
        
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest, textStatus, errorThrown);
      }
    });

  });
  QV.modal_stocks.on('show.bs.modal', function (event) {
    QV.body_scroll_fixed.on();
    QV.modal_stocks.html("");
  });
  QV.modal_stocks.on('hide.bs.modal', function (event) {
    QV.body_scroll_fixed.off();
  });
  QV.modal_stocks.on('shown.bs.modal', function (event) {
    jQuery.ajax({
      type: "GET",
      url: QV.api_url_goods_stocks,
      cache : false,
      dataType: "json",
      data: "goods="+QV.goods,
      success: function(json){
        QV.modal_stocks.html(json.modal);
        var wh = jQuery(window).height();
        var header_height = jQuery('#stocksModal .modal-header').outerHeight()+60;
        
        jQuery('#stocksModal .modal-body').css('max-height',wh-header_height);
        jQuery('#stocksModal tbody.oddeven').each(function(){
          var idx = 0;
          jQuery('tr',jQuery(this)).each(function(){
            var $_this = jQuery(this);
          if($_this.hasClass('head'))return true;
            if(idx % 2 === 0){
              $_this.addClass('odd');
            }else{
              $_this.addClass('even');
            }
            idx+=1;
          });
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest, textStatus, errorThrown);
      }
    });
  });
  
});
