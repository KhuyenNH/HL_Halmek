View.initPage = function(){
  //formhelper
  var helper = new FormHelper(jQuery('#deliveryForm'));
  var helper_sp = new FormHelper(jQuery('#deliveryForm_sp'));

  var $rows = jQuery('#deliverySelectTable > tbody > tr');

  //�ʏ�̔z�������w��
  var deliveryStartDate = DateUtil.computeDate(new Date(),Conf.deliveryDateStart);
  var deliveryEndDate = DateUtil.computeDate(new Date(),Conf.deliveryDateEnd);

  function convertDate(str){
    if(!str)return false;
    var ar = str.split('/');
    if(ar.length !== 3) return false;
    if(!DateUtil.checkDate(ar[0],ar[1],ar[2])) return false;
    return new Date(ar[0],ar[1]-1,ar[2]);
  }

  // input�n��placeholder�͂Ȃ����ꉞ����Ă����B
  helper.setDefaults();
  helper_sp.setDefaults();

  // ���ɑI�𒆂̒l(ATTR:data-selected-value)��ݒ�(����͓��t�I�����Ƃ肠�������点�邵���Ȃ�
  helper.setSelectedValues();
  helper_sp.setSelectedValues();

  // ���t�I���ȊO�̃Z���N�g�{�b�N�X�̍ď�����
  jQuery('select:not(.no-init)',helper.$).selectbox('detach').selectbox(View.selectboxInitObj);
  jQuery('select:not(.no-init)',helper_sp.$).selectbox('detach').selectbox(View.selectboxInitObj);

  /**
   * �e�s�̓��t�I����������
   */
  function initDateSelectsByRowId(rowId, is_sp){
    var sp_sfx = is_sp ? '_sp' : '';
    var helper_ins = is_sp ? helper_sp : helper;
    var $dsBlock = jQuery('#dateSelectBlock' + rowId + sp_sfx);
    var o = $dsBlock.data('ds_vars');

    // console.log('initDateSelectsByRowId',rowId);
    if(!o) return;
    // console.log(' + start.');

    //���t�I���̏������A�C�x���g�ݒ�Ȃ�
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

    // ���ɑI�𒆂̒l(ATTR:data-selected-value)��ݒ�i���߂�
    helper_ins.setSelectedValues($dsBlock);

    //selectbox�͍ŏ��̏������Ȃ̂� .selectbox('detach') ����K�v�Ȃ��B
    jQuery('select.no-init',$dsBlock).selectbox(View.selectboxInitObj);

    //���t�I��selectbox�Q�֓��I�\�����t���b�V���C�x���g��ǉ��B
    View.initForm.dynamicRefleshSelect($dsBlock);

    $dsBlock.data('ds_vars',null);
  }

  $rows.each(jQuery.proxy(function(i,o){
    var $row = jQuery(o);
    var rowId = i + 1;

    //�z�����I��p
    var $dsBlock = jQuery('#dateSelectBlock'+rowId);

    //�z���������Œ�̏ꍇ
    var sdate = convertDate($dsBlock.attr('data-deliveryStart'));
    var edate = convertDate($dsBlock.attr('data-deliveryEnd'));

    // �Z���N�g�{�b�N�X�������pobject
    $dsBlock.data('ds_vars',{
      id:rowId
      ,sd:(sdate && edate) ? sdate : deliveryStartDate
      ,ed:(sdate && edate) ? edate : deliveryEndDate
    });

    //���W�I�{�^���I��
    var $ra1 = jQuery('#deliveryRadio'+rowId+'_1');
    var $ra2 = jQuery('#deliveryRadio'+rowId+'_2');
    var radioname = $ra1.attr('name');
    var toggleFn = jQuery.proxy(function(){
      var $selected = jQuery('#deliveryForm input:radio[name="'+radioname+'"]:checked');
      if($selected.get(0) === $ra1.get(0)){
      // if(!!$ra1.prop('checked') == true){
        // �B��
        $dsBlock.slideUp(320);
      }else{
        // �\��
        $dsBlock.slideDown(320);
        initDateSelectsByRowId(rowId);
      }
    },this);
    $ra1.on('change',toggleFn);
    $ra2.on('change',toggleFn);

    // �z����]����"�w��Ȃ�"�̂Ƃ��͏��������Ȃ�
    if(!$ra2.attr('checked')){
      $dsBlock.hide();
    }else{
      initDateSelectsByRowId(rowId);
    }
    
    //// �ȉ��Asp�p /////////////////////////

    //�z�����I��p
    var $dsBlock2 = jQuery('#dateSelectBlock' + rowId + '_sp');

    //�z���������Œ�̏ꍇ
    var sdate2 = convertDate($dsBlock2.attr('data-deliveryStart'));
    var edate2 = convertDate($dsBlock2.attr('data-deliveryEnd'));

    // �Z���N�g�{�b�N�X�������pobject
    $dsBlock2.data('ds_vars',{
      id:rowId
      ,sd:(sdate2 && edate2) ? sdate2 : deliveryStartDate
      ,ed:(sdate2 && edate2) ? edate2 : deliveryEndDate
    });

    //���W�I�{�^���I��
    var $ra1sp = jQuery('#deliveryRadio'+rowId+'_1'+'_sp');
    var $ra2sp = jQuery('#deliveryRadio'+rowId+'_2'+'_sp');
    var radionamesp = $ra1sp.attr('name');
    var $rasp;  //(2015.04.24�ǋL)

    var toggleflag;
    if (!escapeflag){
      var toggleFnsp = jQuery.proxy(function(){
        //if (!escapeflag){
          if (!toggleflag){
            toggleflag = 1;
            var $selected = $rasp;  //(2015.04.24�ǋL)
            //var $selected = jQuery('input:radio[name="' + radionamesp + '"]:checked');//(2015.04.24�R�����g�A�E�g)
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

      $ra1sp.on('change',function(){ $rasp = $ra1sp; });  //(2015.04.24�ǋL)
      $ra2sp.on('change',function(){ $rasp = $ra2sp; });  //(2015.04.24�ǋL)

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
