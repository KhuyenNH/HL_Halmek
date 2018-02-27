/**
 * ���낢��ݒ�
 * �����i�ڍ׃y�[�W�ȂǂŎg��Ajax���N�G�X�g�p�̃p�X�������ɋL�ڂ��Ă��܂��B
 * ���[�J�����[�h|�T�[�o�[���샂�[�h�̐؂�ւ���<script>�^�O��src�����l�Ő���B
 * ���[�J�����[�h :
 * <script src="path/to/Conf.js?mode=local"></script>
 * �T�[�o�[���샂�[�h :
 * <script src="path/to/Conf.js"></script>
 * @type {Object}
 */
;if(typeof Conf != 'object') var Conf = {};

Conf.me = ReqUtil.getJSPaths('Conf.js',true);
Conf.isLocal = Conf.me.params ? (Conf.me.params.mode && Conf.me.params.mode == 'local' ? true : false) : false;

//�_�~�[�摜�u����console.log()�̏o�͐؂�ւ��B�J�����̓t���O��true�ɁB
Conf.isDevMode = 0;

/**
 * �p�X�ݒ�
 * urlservices dummy�̐؂�ւ�
 */
Conf.PATH = {};
Conf.PATH.js = 'res/js/';
//���[�g��url��js�̃p�X���画�ʂ���悤�ɂ��܂����B���������ݒ肵�Ȃ���OK�ł��B
// Conf.PATH.root = Conf.isLocal ? "/ec/" : "/ec/";
Conf.PATH.root =  Conf.me.path.replace(new RegExp(RegExp.escape(Conf.PATH.js)+'$'),'');
Conf.PATH.http = Conf.PATH.root;
Conf.PATH.img = Conf.PATH.http + EC_WWW_ROOT +"res/img/";
Conf.PATH.json = {
	//ajax�ǂݍ��݊O���t�@�C��(json)
	//���[�g����̃p�X���L��
	//(Conf.isLocal ? "path/to/local" : "path/to/server")
	item_stock : Conf.PATH.http + (Conf.isLocal ? "item/stock.json" : "api/item/findByItemCd")
	,add_to_cart : Conf.PATH.http + (Conf.isLocal ? "item/add2cart.json" : "api/item/addToCart")
	,item_by_catalog : Conf.PATH.http + (Conf.isLocal 
		? "item/item_by_catalog.json" 
		: EC_WWW_ROOT + "shop/search/lookupgoodslistforajax.aspx")
	//[TEST]input�P�ڂƂQ�ڂ̖߂�l��ʂ�
	// ,item_by_catalog2 : Conf.PATH.http + (Conf.isLocal  
	// 	? "item/ibc2.json" 
	// 	: "api/item/findByCatalogItemCd")
	,attentions : Conf.PATH.http + EC_WWW_ROOT +"res/json/attentions.json"
	,research : Conf.PATH.http + EC_WWW_ROOT +"res/json/research.json"
};
Conf.PATH.html = {
	//ajax�ǂݍ��݊O���t�@�C��(html)
};

/**
 * �݌ɐ��̕\���ݒ�Bbadge�\���Ɏg�����肷��B
 * @type {Object}
 */
Conf.stockCnt = {
	many:Infinity //�݌ɂ��� <=
	,less:2 //�c��͂� <= (�݌�*�ȉ���badge�̕\�L���ς��)
	,empty:0 //�݌ɂȂ� <=
};

//��x�ɃV���b�s���O�J�[�g�ɓ�����鐔�ʂ̍ő�l
Conf.qtySelectMax = 10;

//�X���C�_�pcss�N���Xprefix
Conf.sliderPref = 'ifs-';

//selectbox���J���X�s�[�h
Conf.selectOpenSpeed = 280;

//�a�����Z���N�g�{�b�N�X�̒ʏ펞�̒l�B���݂��牽�N�������B
Conf.defBirthdayYearSelectDiff = 55;

//�z�����̃Z���N�g�{�b�N�X�̏����l�B���ݎ�����?����
Conf.deliveryDateStart = 10;
//�z�����̃Z���N�g�{�b�N�X�őI���ł���ŏI���B���ݎ�����?����
Conf.deliveryDateEnd = (7*6)+10;

//ajax���N�G�X�g�̃��\�b�h�͏�ɂ���ŁB�eform��method�D��B
Conf.ajaxMeth = 'post';

/**
 * �J�����[�h|���J���[�h�̋���
 */
if(!Conf.isDevMode){
	jQuery(function(){
		jQuery.log = function(){};
	});
}else{
	//developing mode.
	//�_�~�[�摜�p
	Holder.add_theme("gM",{background:"#DEDAD7", foreground:"#FFFFFF", size:20, font: "Helvetica"});
	// Holder.add_theme("gM",{background:"#FFFFFF", foreground:"#DEDAD7", size:20, font: "Helvetica"});
	// Holder.add_theme("gM",{background:"#0000FF", foreground:"#DEDAD7", size:20, font: "Helvetica"});
}
