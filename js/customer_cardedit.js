var iPostTime = null;
var alreadySubmit = false;

function fSubmit() { 
  if (alreadySubmit == false && iPostTime != null ) {
    alreadySubmit = true;
    return true;
  }
return false;
}

function postCheck()
    {
    if( iPostTime == null )
        {
        iPostTime = 1;
        return true;
        }
    else
        {
        return false;
        }
    }

function IsSubmit(str) {
  if ( iPostTime != null ) { return false; }
  if ( SubmitConfirm(str) == true ) {
    return postCheck();
  }
  return false;
}

function SubmitConfirm (str) {
  return window.confirm(str);
}