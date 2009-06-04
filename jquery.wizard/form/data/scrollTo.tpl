<?if $selector?>$('<?=selector/>')<?else/>$</if?>.scrollTo( '<?=target/>', '<?=duration/>'<?if $settings?>, {
<?if $easing?>	easing:'<?=easing/>',
</if?>	axis:<?=axis/>,
<?if $margin?>	margin:true,
</if?><?if $offset?>	offset:<?=offset/>,
</if?><?if $over?>	over:<?=over/>,
</if?><?if $queue?>	queue:true,
</if?><?if $onAfterFirst?>	onAfterFirst:function( elem ){
	},
</if?><?if $onAfter?>	onAfter:function( elem ){
	},
</if?>}<?else/> </if?>);