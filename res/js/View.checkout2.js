View.initPage = function(){
  //formhelper
  var helper = new FormHelper(jQuery('#deliveryForm'));
  var helper_sp = new FormHelper(jQuery('#deliveryForm_sp'));

  var $rows = jQuery('#deliverySelectTable > tbody > tr');

  //通常の配送日時指定
  var deliveryStartDate = DateUtil.computeDate(new Date(),Conf.deliveryDateStart);
  var deliveryEndDate = DateUtil.computeDate(new Date(),Conf.deliveryDateEnd);

  function convertDate(str){
    if(!str)return false;
    var ar = str.split('/');
    if(ar.length !== 3) return false;
    if(!DateUtil.checkDate(ar[0],ar[1],ar[2])) return false;
    return new Date(ar[0],ar[1]-1,ar[2]);
  }

  // input系のplaceholderはないが一応やっておく。
  helper.setDefaults();
  helper_sp.setDefaults();

  // 既に選択中の値(ATTR:data-selected-value)を設定(これは日付選択もとりあえず走らせるしかない
  helper.setSelectedValues();
  helper_sp.setSelectedValues();

  // 日付選択以外のセレクトボックスの再初期化
  jQuery('select:not(.no-init)',helper.$).selectbox('detach').selectbox(View.selectboxInitObj);
  jQuery('select:not(.no-init)',helper_sp.$).selectbox('detach').selectbox(View.selectboxInitObj);

  /**
   * 各行の日付選択を初期化
   */
  function initDateSelectsByRowId(rowId, is_sp){
    var sp_sfx = is_sp ? '_sp' : '';
    var helper_ins = is_sp ? helper_sp : helper;
    var $dsBlock = jQuery('#dateSelectBlock' + rowId + sp_sfx);
    var o = $dsBlock.data('ds_vars');

    // console.log('initDateSelectsByRowId',rowId);
    if(!o) return;
    // console.log(' + start.');

    //日付選択の初期化、イベント設定など
    helper_ins.initDateSelects(
      '#deliveryYearSelect' + rowId + sp_sfx
      ,'#deliveryMonthSelect' + rowId + sp_sfx
      ,'#deliveryDaySelect' + rowId + sp_sfx
      ,false
      ,o.sd
      ,o.ed
      ,false
      ,false
    );

    // 既に選択中の値(ATTR:data-selected-value)を設定（改めて
    helper_ins.setSelectedValues($dsBlock);

    //selectboxは最初の初期化なので .selectbox('detach') する必要なし。
    jQuery('select.no-init',$dsBlock).selectbox(View.selectboxInitObj);

    //日付選択selectbox群へ動的表示リフレッシュイベントを追加。
    View.initForm.dynamicRefleshSelect($dsBlock);

    $dsBlock.data('ds_vars',null);
  }

  $rows.each(jQuery.proxy(function(i,o){
    var $row = jQuery(o);
    var rowId = i + 1;

    //配送日選択用
    var $dsBlock = jQuery('#dateSelectBlock'+rowId);

    //配送日時が固定の場合
    var sdate = convertDate($dsBlock.attr('data-deliveryStart'));
    var edate = convertDate($dsBlock.attr('data-deliveryEnd'));

    // セレクトボックス初期化用object
    $dsBlock.data('ds_vars',{
      id:rowId
      ,sd:(sdate && edate) ? sdate : deliveryStartDate
      ,ed:(sdate && edate) ? edate : deliveryEndDate
    });

    //ラジオボタン選択
    var $ra1 = jQuery('#deliveryRadio'+rowId+'_1');
    var $ra2 = jQuery('#deliveryRadio'+rowId+'_2');
    var radioname = $ra1.attr('name');
    var toggleFn = jQuery.proxy(function(){
      var $selected = jQuery('#deliveryForm input:radio[name="'+radioname+'"]:checked');
      if($selected.get(0) === $ra1.get(0)){
      // if(!!$ra1.prop('checked') == true){
        // 隠す
        $dsBlock.slideUp(320);
      }else{
        // 表示
        $dsBlock.slideDown(320);
        initDateSelectsByRowId(rowId);
      }
    },this);
    $ra1.on('change',toggleFn);
    $ra2.on('change',toggleFn);

    // 配送希望日が"指定なし"のときは初期化しない
    if(!$ra2.attr('checked')){
      $dsBlock.hide();
    }else{
      initDateSelectsByRowId(rowId);
    }
    
    //// 以下、sp用 /////////////////////////

    //配送日選択用
    var $dsBlock2 = jQuery('#dateSelectBlock' + rowId + '_sp');

    //配送日時が固定の場合
    var sdate2 = convertDate($dsBlock2.attr('data-deliveryStart'));
    var edate2 = convertDate($dsBlock2.attr('data-deliveryEnd'));

    // セレクトボックス初期化用object
    $dsBlock2.data('ds_vars',{
      id:rowId
      ,sd:(sdate2 && edate2) ? sdate2 : deliveryStartDate
      ,ed:(sdate2 && edate2) ? edate2 : deliveryEndDate
    });

    //ラジオボタン選択
    var $ra1sp = jQuery('#deliveryRadio'+rowId+'_1'+'_sp');
    var $ra2sp = jQuery('#deliveryRadio'+rowId+'_2'+'_sp');
    var radionamesp = $ra1sp.attr('name');
    var $rasp;  //(2015.04.24追記)

    var toggleflag;
    if (!escapeflag){
      var toggleFnsp = jQuery.proxy(function(){
        //if (!escapeflag){
          if (!toggleflag){
            toggleflag = 1;
            var $selected = $rasp;  //(2015.04.24追記)
            //var $selected = jQuery('input:radio[name="' + radionamesp + '"]:checked');//(2015.04.24コメントアウト)
            if($selected.get(0) === $ra1sp.get(0)){
              $dsBlock2.slideUp(320);
            }else{
              $dsBlock2.slideDown(320);
              initDateSelectsByRowId(rowId,true);
            }
            setTimeout(function(){
              toggleflag = 0;
            }, 320);
          }
        //}
      },this);

      $ra1sp.on('change',function(){ $rasp = $ra1sp; });  //(2015.04.24追記)
      $ra2sp.on('change',function(){ $rasp = $ra2sp; });  //(2015.04.24追記)

      $ra1sp.on('change',toggleFnsp);
      $ra2sp.on('change',toggleFnsp);
    }

    if(!$ra2sp.attr('checked')){
      $dsBlock2.hide();
    }else{
      initDateSelectsByRowId(rowId,true);
    }
    
  },this));

};
