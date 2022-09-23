<?php

$configs = [
    "url" => "https://resultados-sim.tse.jus.br",
    "ambiente" => "teste",
    "ciclo" => "ele2022",
    "codigo_eleicao" => [
        "municipal" => [
            "codigo" => "9238",
            "disputa" => [
                "0003", "0005", "0006", "0007"
            ],
            "abrangencias" => [
                "61280","63711","64750","69213","70718","71218"
            ]
        ],
        "estadual" => [
            "codigo" => "9238",
            "disputa" => [
                "0001","0003","0005","0006","0007","0008"
            ],
            "abrangencias" => [
                "ac","al","ap","am","ba","ce","es","go","ma","mt","ms","mg","pa","pb","pr","pe","pi","rj","rn","rs","ro","rr","sc","sp","se","to","df"
            ]
        ],
        "federal" => [
            "codigo"=> "9240",
            "disputa" => [
                "0001"
            ],
            "abrangencias" => [
                "br"
            ]
        ],
    ]
];

define("PATHS", [
    "eleicoes" => "C:/Users/henrique.junior/Desktop/VCS-Server/eleicoes"
]);

//function getEstadual($configs){
//    $tipoEleicao = 'estadual';
//
//    $ch_gov = curl_init();
//    $ch_sen = curl_init();
//    $ch_des = curl_init();
//    $ch_def = curl_init();
//    $ch_ded = curl_init();
//
//
//    foreach ($configs['codigo_eleicao']['estadual']['abrangencias'] as $uf):
//        foreach ($configs['codigo_eleicao']['estadual']['disputa'] as $cargo):
//            if(($cargo == '0008' && $uf != 'df') || ($cargo == '0007') && $uf == 'df'):
//                continue;
//            endif;
//
//            $url = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados-simplificados/{$uf}/{$uf}-c{$cargo}-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json";
//            $file = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$uf}/{$uf}-c{$cargo}-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json",'w');
//
//            curl_setopt_array($ch, array(
//                CURLOPT_URL => $url,
//                CURLOPT_RETURNTRANSFER => true,
//                CURLOPT_FILE => $file,
//                CURLOPT_TIMEOUT => 10,
//                CURLOPT_FOLLOWLOCATION => false,
//                CURLOPT_CUSTOMREQUEST => "GET",
//            ));
//
//            curl_exec($ch);
//        endforeach;
//    endforeach;
//    curl_close($ch);
//};

function getEstadualMulti($configs){
    $tipoEleicao = 'estadual';

    $ch_gov = curl_init();
    $ch_sen = curl_init();
    $ch_des = curl_init();
    $mh = curl_multi_init();

    foreach ($configs['codigo_eleicao']['estadual']['abrangencias'] as $uf):
        $urlgov = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados-simplificados/{$uf}/{$uf}-c0003-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json";
        $urlsen = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados-simplificados/{$uf}/{$uf}-c0005-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json";
        $urldes = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados-simplificados/{$uf}/{$uf}-c0006-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json";


        $filegov = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$uf}/{$uf}-c0003-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json",'w');
        $filesen = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$uf}/{$uf}-c0005-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json",'w');
        $filedes = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$uf}/{$uf}-c0006-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json",'w');

        if($uf == 'df'):
            $ch_ded = curl_init();
            $fileded = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$uf}/{$uf}-c0008-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json",'w');
            $urlded = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados-simplificados/df/df-c0008-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json";
            curl_setopt_array($ch_ded, array(CURLOPT_URL => $urlded,CURLOPT_RETURNTRANSFER => true,CURLOPT_FILE => $fileded,CURLOPT_TIMEOUT => 10,CURLOPT_FOLLOWLOCATION => false,CURLOPT_CUSTOMREQUEST => "GET"));
            curl_multi_add_handle($mh, $ch_ded);
        else:
            $ch_def = curl_init();
            $urldef = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados-simplificados/{$uf}/{$uf}-c0007-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json";
            $filedef = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$uf}/{$uf}-c0007-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json",'w');
            curl_setopt_array($ch_def, array(CURLOPT_URL => $urldef,CURLOPT_RETURNTRANSFER => true,CURLOPT_FILE => $filedef,CURLOPT_TIMEOUT => 10,CURLOPT_FOLLOWLOCATION => false,CURLOPT_CUSTOMREQUEST => "GET"));
            curl_multi_add_handle($mh, $ch_def);
        endif;

        curl_setopt_array($ch_gov, array(CURLOPT_URL => $urlgov,CURLOPT_RETURNTRANSFER => true,CURLOPT_FILE => $filegov,CURLOPT_TIMEOUT => 10,CURLOPT_FOLLOWLOCATION => false,CURLOPT_CUSTOMREQUEST => "GET"));
        curl_setopt_array($ch_sen, array(CURLOPT_URL => $urlsen,CURLOPT_RETURNTRANSFER => true,CURLOPT_FILE => $filesen,CURLOPT_TIMEOUT => 10,CURLOPT_FOLLOWLOCATION => false,CURLOPT_CUSTOMREQUEST => "GET"));
        curl_setopt_array($ch_des, array(CURLOPT_URL => $urldes,CURLOPT_RETURNTRANSFER => true,CURLOPT_FILE => $filedes,CURLOPT_TIMEOUT => 10,CURLOPT_FOLLOWLOCATION => false,CURLOPT_CUSTOMREQUEST => "GET"));

        curl_multi_add_handle($mh, $ch_gov);
        curl_multi_add_handle($mh, $ch_sen);
        curl_multi_add_handle($mh, $ch_des);

        do{
            $status = curl_multi_exec($mh, $active);
            if($active){
                curl_multi_select($mh);
            }
        }while($active && $status == CURLM_OK);

        curl_multi_remove_handle($mh, $ch_gov);
        curl_multi_remove_handle($mh, $ch_sen);
        curl_multi_remove_handle($mh, $ch_des);

        if(isset($ch_ded)){
            curl_multi_remove_handle($mh, $ch_ded);
            unset($ch_ded);
        }elseif (isset($ch_def)){
            curl_multi_remove_handle($mh, $ch_def);
            unset($ch_def);
        }

    endforeach;

    curl_multi_close($mh);

}

function getMunicipalMulti($configs)
{
    $tipoEleicao = 'estadual';

    $ch_gov = curl_init();
    $ch_sen = curl_init();
    $ch_des = curl_init();
    $ch_def = curl_init();
    $mh = curl_multi_init();

    foreach ($configs['codigo_eleicao']['municipal']['abrangencias'] as $municipio):

        $urlpre = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados/sp/sp{$municipio}-c0001-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json";
        $urlgov = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados/sp/sp{$municipio}-c0003-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json";
        $urlsen = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados/sp/sp{$municipio}-c0005-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json";
        $urldes = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados/sp/sp{$municipio}-c0006-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json";
        $urldef = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados/sp/sp{$municipio}-c0007-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json";


//            $filepre = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$municipio}/sp{$municipio}-c0001-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json",'w');
        $filegov = fopen(
            PATHS['eleicoes'] . "/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$municipio}/sp{$municipio}-c0003-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json",
            'w'
        );
        $filesen = fopen(
            PATHS['eleicoes'] . "/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$municipio}/sp{$municipio}-c0005-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json",
            'w'
        );
        $filedes = fopen(
            PATHS['eleicoes'] . "/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$municipio}/sp{$municipio}-c0006-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json",
            'w'
        );
        $filedef = fopen(
            PATHS['eleicoes'] . "/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/{$municipio}/sp{$municipio}-c0007-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-v.json",
            'w'
        );

//            curl_setopt_array($ch_pre, array(CURLOPT_URL => $urlpre,CURLOPT_RETURNTRANSFER => true,CURLOPT_FILE => $filepre,CURLOPT_TIMEOUT => 10,CURLOPT_FOLLOWLOCATION => false,CURLOPT_CUSTOMREQUEST => "GET"));
        curl_setopt_array(
            $ch_gov,
            array(
                CURLOPT_URL => $urlgov,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FILE => $filegov,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_CUSTOMREQUEST => "GET"
            )
        );
        curl_setopt_array(
            $ch_sen,
            array(
                CURLOPT_URL => $urlsen,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FILE => $filesen,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_CUSTOMREQUEST => "GET"
            )
        );
        curl_setopt_array(
            $ch_des,
            array(
                CURLOPT_URL => $urldes,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FILE => $filedes,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_CUSTOMREQUEST => "GET"
            )
        );
        curl_setopt_array(
            $ch_def,
            array(
                CURLOPT_URL => $urldef,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FILE => $filedef,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_CUSTOMREQUEST => "GET"
            )
        );

//            curl_multi_add_handle($mh, $ch_pre);
        curl_multi_add_handle($mh, $ch_gov);
        curl_multi_add_handle($mh, $ch_sen);
        curl_multi_add_handle($mh, $ch_des);
        curl_multi_add_handle($mh, $ch_def);

        do {
            $status = curl_multi_exec($mh, $active);
            if ($active) {
                curl_multi_select($mh);
            }
        } while ($active && $status == CURLM_OK);

//            curl_multi_remove_handle($mh, $ch_pre);
        curl_multi_remove_handle($mh, $ch_gov);
        curl_multi_remove_handle($mh, $ch_sen);
        curl_multi_remove_handle($mh, $ch_des);
        curl_multi_remove_handle($mh, $ch_def);

    endforeach;

    curl_multi_close($mh);
}

function getFederal($configs){
    $tipoEleicao = 'federal';
    $ch = curl_init();


    $url = "{$configs['url']}/{$configs['ambiente']}/{$configs['ciclo']}/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/dados-simplificados/br/br-c0001-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json";
    $file = fopen(PATHS['eleicoes']."/{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}/br/br-c0001-e00{$configs['codigo_eleicao'][$tipoEleicao]['codigo']}-r.json",'w');

    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FILE => $file,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CUSTOMREQUEST => "GET",
    ));

    curl_exec($ch);

    curl_close($ch);
}

getMunicipalMulti($configs);
getEstadualMulti($configs);
getFederal($configs);