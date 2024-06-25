<?php

namespace App\Enums;

enum UserRoles: string
{
   case USER = 'user';
   case PREMIUM_USER = 'premium';
   case ADMIN = 'amin';
}
