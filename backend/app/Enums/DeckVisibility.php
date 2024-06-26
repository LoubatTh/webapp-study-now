<?php

namespace App\Enums;

enum DeckVisibility: string
{
    case PUBLIC = "Public";
    case PRIVATE = "Private";
    case LIMITED = "Limited";
}
